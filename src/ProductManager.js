const fs = require("fs");
const path = require("path");

class ProductManager {
    constructor(){
        this.path = path.join(__dirname, 'products.json');
        this.loadProducts();
    }

    async loadProducts(){
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
        } catch (error) {
            this.products = [];
        }
    }
    
    getProducts(limit=null){
        if(this.products.length === 0){
            return {
                statusCode: 404,
                message: `No products found`
            }
        }

        if(limit){
            return this.products.slice(0, limit);
        }

        return this.products;
    }

    async addProduct(title, description, price, thumbnail, code, stock){

        if(title==="" || description==="" || price === "" || thumbnail === "" || code === "" || stock === ""){
            console.log(`All fields are required`);
            return;
        }

        const product = this.products.find((product)=>product.code === code);
        
        if(product){
            console.log(`Product with code ${code} duplicated`);
            return;
        }

        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code, 
            stock
        };
        
        if(this.products.length !== 0){
            newProduct.id = this.products[this.products.length - 1].id + 1;         
        }else{
            newProduct.id = 1;         
        }
        
        this.products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    }

    getProductById(productId){
        try {
            this.loadProducts();
            const findProduct = this.products.find((product) => product.id === productId);
            if(!findProduct){
                return {
                    statusCode: 404,
                    message: `Product Not Found`
                };   
            }
            return findProduct;
        } catch (error) {
            return [];
        }
    }

    async updateProduct(productId, params){
        try{
            await this.loadProducts();
            this.products = this.products.map((product) => {
                if(product.id === productId){
                    return { ...product, ...params }
                }
                return product;
            });
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return {
                statusCode: 200,
                message: "Product updated"
            };
        }catch(error){
            return {
                statusCode: 500,
                message: error
            };
        }
    }

    async deleteProduct(productId){
        try{
            await this.loadProducts();
            this.products = this.products.filter((product) => product.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return {
                statusCode: 200,
                message: "Product deleted"
            };
        }catch(error){
            return {
                statusCode: 500,
                message: error
            };
        }
    }
}

module.exports = {
    ProductManager
}