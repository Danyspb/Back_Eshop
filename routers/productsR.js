const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const routers = express.Router();
const mongoose = require('mongoose');


routers.get(`/`, async (req, res) => {
    const productList = await Product.find().populate('category');

    if(!productList){
        res.status(500).json({succes: false})
    }

    res.send(productList)
})

////// avoir les produits par categories ///////
routers.get(`/bycategories`, async (req, res) => {
    
    if(req.query.categories){
       var filter = {category: req.query.categories.split(',')}
    }
    const prodbycat = await Product.find(filter).populate('category');

    if(!prodbycat){
        res.status(500).json({succes: false})
    }

    res.send(prodbycat)
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


routers.get('/:id', async (req, res)=>{
    let prodtrouv = await Product.findById(req.params.id).populate('category');
    if(!prodtrouv){
        return res.status(404).json({succes: false, mesage: 'le produit n\'existe pas' })
    }else{
        return res.status(200).json({succes: true, prodtrouv})
    }
})


routers.delete('/:id', async (req,res)=>{
    let proddelt = await Product.findByIdAndRemove(req.params.id)
    if(!proddelt){
        return res.status(500).json({succes: false, message: 'produit inexistant'})
    }else{
        return res.status(200).json({succes: true, message: 'produit effacee avec succes'})
    }

})

routers.put('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status.apply(400).send('invalid Product id')
    }
    const categofound = await Category.findById(req.body.category);
    if(!categofound) return res.status(400).send('invalid Category')
    let produpd = await Product.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        {new : true}
    )
    if(produpd){
        return res.status(201).json({succes: true, message: 'produit modifier avec succes', produpd})
    }else{
        return res.status(500).json({succes: false, message: 'produit non modiifier du a une erreur'})
    }
})


////// avoir le nombre de produits ///////////
routers.get('/get/count', async (req, res)=>{
    let prodCount = await Product.countDocuments({})
    if(!prodCount){
        return res.status(404).json({succes: false, mesage: 'le produit n\'existe pas' })
    }else{
        res.send({
            count: prodCount
        })
    }
})

////// avoir nombre de produit dont la feature est true  ////// 
routers.get('/get/feature/:count', async (req, res)=>{
    let count = req.params.count ? req.params.count : 0
    let prodFeatur = await Product.find({isFeatured: true}).limit(count)
    if(!prodFeatur){
        return res.status(404).json({succes: false, mesage: 'le produit n\'existe pas' })
    }else{
        res.send(prodFeatur)
    }
})

module.exports = routers;