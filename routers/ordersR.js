const {Order} = require('../models/order');
const express = require('express');
const routers = express.Router();



routers.get(`/`, async(req,res)=>{
    const orderList = await Order.find();

    if(!orderList){
        res.status(500).json({succes: false})
    }

    res.send(orderList)

})

module.exports = routers;