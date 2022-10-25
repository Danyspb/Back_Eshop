const {Product} = require('../models/product')
const express = require('express');
const routers = express.Router();


routers.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({succes: false})
    }

    res.send(productList)
})

routers.post(`/`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        quantity: req.body.quantity
        })
            
        product.save()
        .then((createprod)=>{
         res.status(201).json(createprod)
        })
        .catch((err)=>{
         res.status(500).json({
            error: err,
            succes: false
        })
    })
})

module.exports = routers;  