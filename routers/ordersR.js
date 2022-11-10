const {Order} = require('../models/order');
const express = require('express');
const routers = express.Router();



routers.get(`/`, async(req,res)=>{
    const orderList = await Order.find();
    if(!orderList){
       return res.status(404).json({succes: false, message: 'Aucune commande trouve !!!'})
    }else{
       return res.status(200).json({succes: true, orderList})
    }

})

module.exports = routers;