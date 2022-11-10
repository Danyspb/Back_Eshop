const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const routers = express.Router();



routers.get(`/`, async(req,res)=>{
    const orderList = await Order.find();
    if(!orderList){
       return res.status(404).json({succes: false, message: 'Aucune commande trouve !!!'})
    }else{
       return res.status(200).json({succes: true, orderList})
    }

})

routers.post('/', async (req, res)=>{
   const orderItemsIds = Promise.all(req.body.orderItems.map(async order =>{
      let nouOrItem = new OrderItem({
         quantity: order.quantity,
         product: order.product
      })
      nouOrItem = await nouOrItem.save();

      return nouOrItem._id;
   }))

   const comItemIdsResolve = await orderItemsIds;
   

   let nouvOrder = new Order({
       orderItems: comItemIdsResolve,
       shippingAddresse1: req.body.shippingAddresse1,
       shippingAddresse2: req.body.shippingAddresse2,
       city: req.body.city,
       country: req.body.country,
       phone: req.body.phone,
       status: req.body.status,
       zip: req.body.zip,
       totalPrice: req.body.totalPrice,
       user: req.body.user
   })
      nouvOrder = await nouvOrder.save();
   if(!nouvOrder){
      return res.status(500).json({succes: false, message: 'erreur lors de la commande !!!'})
   }else{
      return res.status(201).json({succes: true, nouvOrder})
   }
})

module.exports = routers;