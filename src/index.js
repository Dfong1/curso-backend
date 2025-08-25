import express from 'express';
import errorHandler from './middlewares/error-handler.js';
import productRouter from './routes/product-router.js';
import cartRouter from './routes/cart-router.js';
import viewsRouter from './routes/views-router.js';
import handlebars  from 'express-handlebars'; //npm i express-handlebars@3.0.0
import { Server } from 'socket.io'; 


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());

app.set('views', `${process.cwd()}/src/views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

app.use(errorHandler);

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
})


const socketServer = new Server