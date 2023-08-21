const express = require("express");
const dotenv = require("dotenv");
const { ProductManager } = require("./ProductManager.js");

const productManager = new ProductManager();

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        status: "Ok!"
    })
});

app.get("/products", (req, res) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);   
    res.status(200).json({
        data: products
    })
});

app.get("/product/:id", (req, res) => {
    const { id } = req.params;
    const product = productManager.getProductById(Number(id));
    res.status(200).json({
        data: product
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}...`);
});