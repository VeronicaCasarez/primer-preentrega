import { Router } from "express";

import ProductManager from "../../classes/ProductManager.js";


const productsRouter = Router();

const productManager = new ProductManager("./src/products.json");

// Ruta raíz GET /api/products

productsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Ruta GET /api/products/:pid
productsRouter.get('/:pid',async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductById(productId);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// Ruta raíz POST /api/products
productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  
  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: "Faltan datos suficientes para agregar el producto, thumbnails no es obligatorio" });
    return;
  }else{
    const existingProduct = await productManager.getProductByCode(code);
    if (existingProduct) {
      res.status(400).json({ error: "El código del producto ya existe" });
      return;
  }
  }
  try {
    const newProduct = {
      id: productManager.productId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    await productManager.addProduct(newProduct);

    res.status(201).json({ message: "Producto agregado correctamente", data: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

// Ruta PUT /api/products/:pid
productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); 
    const updatedFields = req.body; 


    const existingProduct = await productManager.getProductById(productId);
    if (!existingProduct) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

   
    await productManager.updateProduct(productId, updatedFields);

    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});


// Ruta DELETE /api/products/:pid
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); 
   
    const existingProduct = await productManager.getProductById(productId);
    if (!existingProduct) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    
    await productManager.deleteProduct(productId);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});




export default productsRouter;