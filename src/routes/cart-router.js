import Router from 'express';
import { cartManager } from './manager/carts-manager.js';

const router = Router();

//! CARTS ENDPOINTS
router.post('/api/carts', async (req, res, next) => {
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

router.get('/api/carts/:cid', async (req, res, next) => {
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

router.post('/api/carts/:cid/product/:pid', async (req, res, next) => {
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

export default router;