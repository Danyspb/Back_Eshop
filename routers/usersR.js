const {User} = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const routers = express.Router();



///// get all users //////
routers.get(`/`, async(req,res)=>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({succes: false})
    }

    res.send(userList)

})


routers.post('/', async(req, res)=>{
    let creatuser = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        street:req.body.street,
        apartement: req.body.apartement,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin
    }) 
    creatuser = await creatuser.save();
    if(!creatuser){
        return res.status(500).json({succes: false, message: 'utilisateur non cree !!!'})
    }else{
        return res.status(201).json({succes: true, message: 'utilisateur cree avec succes !!!'})
    }
})


routers.get('/:id', async(req,res)=>{
    let finduser = await User.findById(req.params.id).select('-passwordHash');
    if(!finduser){
        return res.status(404).json({succes: false, message: 'error user not found'})
    }else{
        return res.status(200).json({succes: true, finduser})
    }

})

////// user connecte ////////
routers.post('/login', async(req, res)=>{
    let userexist = await User.findOne({email: req.body.email});
    if(!userexist){
        return res.status(404).json({succes: false, message: 'error login or password incorrecct !!!!!'})
    }else{
        if(userexist && bcrypt.compareSync(req.body.passwordHash, userexist.passwordHash)){
            let mysect= process.env.SEC_TOK;
            let token = jwt.sign(
                {
                    userId : userexist.id
                },
                mysect,
                {
                    expiresIn: '2d'
                }
            )
            return res.status(200).send({user: userexist.email, token: token})
        }else{
            return res.status(404).json({succes: false, message: 'error login or password incorrecct !!!!'})
        }
        
    }
})

module.exports = routers;