const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const routers = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const storage = multer.diskStorage({
   destination: function(req, file, cb){
      const isValideFile = FILE_TYPE_MAP[file.mimetype];
      let upLoaderError = new Error('invalid image type');
      if(isValideFile){
        upLoaderError = null
      }
      cb(upLoaderError , 'public/upload')
   },
   filename: function (req, file, cb){
      const fileName = file.originalname.replace(/(.png|.jpeg|.jpg)/,'')
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
   }
})

const uploadOption = multer({storage: storage})



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


routers.post(`/`, uploadOption.single('image'), async (req, res) => {
    const categoryatrouve = await Category.findById(req.body.category);

    if(!categoryatrouve){
        return res.status(400).send('Invalid Category')
    }
    const file = req.file;
    if(!file){
        return res.status(400).send('No File')
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image:`${basePath}${fileName}`,
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


routers.put('/:id', uploadOption.single('image'), async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status.apply(400).send('invalid Product id')
    }
    const categofound = await Category.findById(req.body.category);
    if(!categofound){return res.status(400).send('invalid Category')}

    const producF = await Product.findById(req.params.id);
    if(!producF){return res.status(400).send('Invalid Product')}

    const file = req.file;
    let imagepath ;

    if(file){
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        imagepath = `${basePath}${fileName}`
    }else{
        imagepath = producF.image;
    }

    let produpd = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
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


routers.put('/gallery-images/:id', uploadOption.array('images', 5), async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status.apply(400).send('invalid Product id')
    }
    
    const files = req.files
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    if(files){
       files.map(file=>{
        imagesPaths.push(`${basePath}${file.filename}`);
       })
    }
    
    let pro = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        {new : true}
    )
    if(!pro){
        return res.status(404).send('the product cannot be updated !!!!')
    }else{
        return res.send(pro);
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