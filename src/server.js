import express from 'express';
import productRouter from './routes/product-router.js';
import cartRouter from './routes/cart-router.js';
import viewsRouter from './routes/views-router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import { errorHandler } from './middlewares/error-handler.js';


const app = express();

console.log({__dirname});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);


app.use(errorHandler);

const httpServer = app.listen(8080, () => console.log('Server is running on http://localhost:8080'))


const socketServer = new Server(httpServer);

export { socketServer };

socketServer.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('newProduct', (product) => {
        console.log('New product added:', product);
    });

    socket.on('deleteProduct', (productId) => {
        console.log('Product deleted:', productId);
    });
})