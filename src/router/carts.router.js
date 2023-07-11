import express from "express";
import fs from "fs";

const cartsRouter = express.Router();
const cartPath = "./carts.json";

// Obtener todos los productos del carrito
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cartsData = await readDataFromFile();
    const cart = cartsData.find((cart) => cart.id === cartId);

    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }

    res.json({ products: cart.products });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// Agregar un producto al carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1; 

    const cartsData = await readDataFromFile();
    const cart = cartsData.find((cart) => cart.id === cartId);

    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }

    const existingProduct = cart.products.find((product) => product.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    await writeDataToFile(cartsData);

    res.json({ message: "Producto agregado al carrito correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});


// Crear un nuevo carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const cartId = generateCartId();
    const newCart = { id: cartId, products: [] };

    const cartsData = await readDataFromFile();
    cartsData.push(newCart);

    await writeDataToFile(cartsData);

    res.status(201).json({ message: "Carrito creado correctamente", cartId });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Función para leer los datos del archivo carts.json
async function readDataFromFile() {
  try {
    const data = await fs.promises.readFile(cartPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Función para escribir los datos en el archivo carts.json
async function writeDataToFile(data) {
  try {
    await fs.promises.writeFile(cartPath, JSON.stringify(data), "utf-8");
  } catch (err) {
    console.log(err);
  }
}

// Función para generar un ID único para el carrito
function generateCartId() {
  return Date.now().toString();
}

export default cartsRouter;
