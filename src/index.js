import express from 'express';
import { productManager } from './manager/products-manager.js';
import { cartManager } from './manager/carts-manager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hola mundo");
})

/**
 * !PRODUCTS ENDPOINTS
 */
app.post('/api/products', async (req, res, next) => {
    try {
        const data = req.body;
        if(!data.title || !data.description || !data.code || !data.price || !data.status || !data.stock || !data.category || !data.thumbnails) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if(typeof data.title !== 'string' || typeof data.description !== 'string' || typeof data.code !== 'string' || typeof data.price !== 'number' || typeof data.status !== 'boolean' || typeof data.stock !== 'number' || typeof data.category !== 'string') {
            return res.status(400).json({ error: 'Invalid data types' });
        }

        if(!Array.isArray(data.thumbnails)) {
            return res.status(400).json({ error: 'Thumbnails must be an array' });
        }

        const product = await productManager.createProduct(data);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

app.get('/api/products', async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

app.get('/api/products/:pid', async(req, res, next) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${pid} not found` });
        }

        console.log(product)
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error)
    }
});

app.put('/api/products/:pid', async (req, res, next) => {
    const pid = req.params.pid;
    const updatedFields = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(pid, updatedFields);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

app.delete('/api/products/:pid', async (req, res, next) => {
    const pid = req.params.pid;

    try {
        const result = await productManager.deleteProduct(pid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

//! END PRODUCTS ENDPOINTS

//! CARTS ENDPOINTS
app.post('/api/carts', async (req, res, next) => {
    try {
        const data = req.body;
        
        if(!data.products || !Array.isArray(data.products)) {
            return res.status(400).json({ error: 'Products must be an array' });
        }

        const cart = await cartManager.createCart(data);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

app.get('/api/carts/:cid', async (req, res, next) => {
    const cid = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: `Cart with ID ${cid} not found` });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: `Cart with ID ${cid} not found` });
        }

        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${pid} not found` });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(p => p.product === pid);
        if (existingProductIndex !== -1) {
            // If it exists, increment the quantity
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // If it doesn't exist, add it with quantity 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cartManager.updateCart(cid, { products: cart.products });
        
        res.status(200).json({ message: `Product ${pid} added to cart ${cid}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});

//! END CARTS ENDPOINTS


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
})
