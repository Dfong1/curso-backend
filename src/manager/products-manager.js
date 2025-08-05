import fs from 'fs';
class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        const products = await fs.promises.readFile(this.path, 'utf-8')
        .then(data => JSON.parse(data))
        .catch(() => []);
        return products;
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        const product = products.find(p => p.id == pid);
        if (!product) {
            throw new Error(`Product with ID ${pid} not found`);
        }

        // console.log(product)
        return product;
    }

    async createProduct(obj) {
        const product = { ...obj };
        product.id = crypto.randomUUID();
        product.status = true; // Default status to true
        const products = await this.getProducts();  
        if (products.find(p => p.code === product.code)) {
            throw new Error(`Product with code ${product.code} already exists`);
        }
        products.push(product);
        await this.saveProducts(products);
        return {product: product.title};
    }

    async saveProducts(prods){
        await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 4));
    }

    async updateProduct(pid, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == pid);
        if (index === -1) {
            throw new Error(`Product with ID ${pid} not found`);
        }
        products[index] = { ...products[index], ...updatedFields };
        await this.saveProducts(products);
        return products[index];
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == pid);
        if (index === -1) {
            throw new Error(`Product with ID ${pid} not found`);
        }
        products.splice(index, 1);
        await this.saveProducts(products);
        return { message: `Product with ID ${pid} deleted successfully` };
    }

}

export const productManager = new ProductManager('./src/data/products.json');