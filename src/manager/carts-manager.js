import fs from 'fs';
class CartManager {

    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        const carts = await fs.promises.readFile(this.path, 'utf-8')
            .then(data => JSON.parse(data))
            .catch(() => []);
        return carts;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(p => p.id == cid);
        if (!cart) {
            throw new Error(`Cart with ID ${cid} not found`);
        }
        const products = cart.products || [];
        return {products};
    }

    async createCart(obj) {
        const cart = { ...obj };
        cart.id = crypto.randomUUID();
        console.log(cart)
        const carts = await this.getCarts();  
        carts.push(cart);
        await this.saveCarts(carts);
        return {cart: cart.id};
    }

    async saveCarts(carts){
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4));
    }

    async updateCart(cid, updatedFields) {
        const carts = await this.getCarts();
        const index = carts.findIndex(p => p.id == cid);
        if (index === -1) {
            throw new Error(`Cart with ID ${cid} not found`);
        }
        carts[index] = { ...carts[index], ...updatedFields };
        await this.saveCarts(carts);
        return carts[index];
    }

    async deleteCart(cid) {
        const carts = await this.getcarts();
        const index = carts.findIndex(p => p.id == cid);
        if (index === -1) {
            throw new Error(`Cart with ID ${cid} not found`);
        }
        carts.splice(index, 1);
        await this.saveCarts(carts);
        return { message: `Cart with ID ${cid} deleted successfully` };
    }

}

export const cartManager = new CartManager('./src/data/carts.json');