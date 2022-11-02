const {Category} = require('../models/category');
const express = require('express');
const routers = express.Router();


/// get all categorie
routers.get('/', async (req, res)=>{
    let catlist = await Category.find();
    if(!catlist){
        res.status(400).json({succes: false, message: 'il y\'a une erreur '})
    }else{
        res.status(200).send(catlist)
    }
})

//// put a new categorie
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


//// delete one categories
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


//// get one categorie details
routers.get('/:id', async (req, res)=>{
    let categoryfound = await Category.findById(req.params.id);
    if(categoryfound){
        return res.status(200).json({succes: true, categoryfound})
    }else{
        return res.status(404).json({succes: false, message: 'categories pas trouve !!'})
    }
})

///// update categorie
routers.put('/:id' , async (req,res)=>{
    let categorymody = await Category.findOneAndUpdate(
        req.body.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            },
            {new : true}
        );
    if(!categorymody){
        return res.status(404).json({succes: false, message: 'categorie pas trouvee !!'})
    }else{
        return res.status(200).json({succes: true, categorymody})
    }
})


module.exports = routers;