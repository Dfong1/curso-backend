import Router from 'express';
import { productManager } from '../manager/products-manager.js';

const router = Router();

router.get('/', async(req, res) => {
    try {
        const products = await productManager.getProducts();
        
        // format the price object to currency
        const products_formatted = products.map(product => {
            return {
                ...product,
                price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
            }
        });

        res.render('home', { products: products_formatted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;