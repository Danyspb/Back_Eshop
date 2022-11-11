const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const routers = express.Router();

                                        
                                     // populate nous permet de choisir ce qu'on veux recuperer de user et
routers.get(`/`, async(req,res)=>{   // sort -1 me permet de le trier du plus recent au plus ancien enregistrements
    const orderList = await Order.find().populate('user','name').sort({'dateOrder': -1});
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

routers.get('/:id', async (req, res)=>{
  let foundOrder = await Order.findById(req.params.id)
   .populate('user', 'name')
   .populate({
      path: 'orderItems', populate: {
         path: 'product', populate: 'category'}
      })
      if(!foundOrder){
         return res.status(404).json({succes: false, message: 'aucune commande trouvee !!!!'})
      }else{
         return res.status(200).json({succes: true, foundOrder})
      }
      
})

//  



module.exports = routers;