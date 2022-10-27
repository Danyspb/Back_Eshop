const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const routers = express.Router();


routers.get(`/`, async (req, res) => {
    const productList = await Product.find().select('-_id brand name price quantity');

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


routers.get('/:id', async (req, res)=>{
    let prodtrouv = await Product.findById(req.params.id)
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
    let prodfi = Product.findById(req.params.id)
    if(!prodfi){
        return res.status(500).send('Produit invalide')
    }
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
        return res.status(200).json({succes: true, message: 'produit modifier avec succes', produpd})
    }else{
        return res.status(500).json({succes: false, message: 'produit non modiifier du a une erreur'})
    }
})


module.exports = routers;  