const {Category} = require('../models/category');
const express = require('express');
const routers = express.Router();



routers.get(`/`, async(req,res)=>{
    const categoryList = await Category.find();

    if(!categoryList){
        res.status(500).json({succes: false})
    }
    res.send.status(200).send(categoryList);
})

routers.post('/', async (req, res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();
    if(!category){
        return res.status(404).send('la categorie ne peut pas etre cree!!!')
    }else{
        res.send(category);
    }
})

routers.delete('/:id', async (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({succes: true, message: 'categorie trouvee et effacee !!' })
        }else{
            return res.json.status(404).json({succes: false, message: 'il existe pas  !!!'})
        }
    })
    .catch(err=>{
        return res.status(400).json({succes: false, err})
    })
})

routers.get('/:id', async (req, res)=>{
    let categoryfound = await Category.findById(req.params.id);
    if(categoryfound){
        return res.status(200).json({succes: true, categoryfound})
    }else{
        return res.status(404).json({succes: false, message: 'categories pas trouve'})
    }
})

module.exports = routers;