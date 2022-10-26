const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const routers = express.Router();


routers.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({succes: false})
    }

    res.send(productList)
})

routers.post(`/`, async (req, res) => {
    const categoryatrouve = await Category.findById(req.body.category);

    if(!categoryatrouve){
        return res.status(400).send('Invalid Category')
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
        })  

    productcreat =  await product.save();
    if(!productcreat){
        return res.status(500).json({succes: false, message: "le produit n\'est pas cree"})
    }else{
        return res.status(201).json({succes: true, productcreat})
    }
})

module.exports = routers;  