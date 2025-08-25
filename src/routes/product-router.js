import Router from 'express';
import { productManager } from './manager/products-manager.js';

const router = Router();

router.get('/', (req, res) => {
    res.send("Hola mundo");
})

/**
 * !PRODUCTS ENDPOINTS
 */
router.post('/api/products', async (req, res, next) => {
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

router.get('/api/products', async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.get('/api/products/:pid', async(req, res, next) => {
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

router.put('/api/products/:pid', async (req, res, next) => {
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

router.delete('/api/products/:pid', async (req, res, next) => {
    const pid = req.params.pid;

    try {
        const result = await productManager.deleteProduct(pid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
});


export default router;