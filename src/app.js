import express from 'express';
import productsRouter from './router/products.router.js';
import cartsRouter from'./router/carts.router.js';

const app = express();

const PORT=8080;

app.use(express.json());

// app.get('/', productsRouter);

// app.get('/', (req,res)=>{
//   res.send("hola mundo ")
// });

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
