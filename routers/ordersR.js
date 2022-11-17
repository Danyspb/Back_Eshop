const {Order} = require('../models/order');
const express = require('express');
const { OrderItems } = require('../models/order-item');
const routers = express.Router();

                                        
                                     // populate nous permet de choisir ce qu'on veux recuperer de user et
routers.get(`/`, async(req,res)=>{   // sort -1 me permet de le trier du plus recent au plus ancien enregistrements
    const orderList = await Order.find().populate('user','name').sort({dateOrdered: -1});
    if(!orderList){
       return res.status(404).json({succes: false, message: 'Aucune commande trouve !!!'})
    }else{
       return res.status(200).json({succes: true, orderList})
    }

})



routers.delete('/:id', async (req, res)=>{
   Order.findByIdAndRemove(req.params.id).then(async order =>{
      if(order){
         order.orderItems.map(async (ordIt) => {
            await OrderItems.findByIdAndRemove(ordIt);
         })
         return res.status(200).json({succes: true, message: 'order delete with succes !!'})
      }else{
         return res.status(404).json({succes: false, message: 'Error Order not found !!!'})     }
   })
   .catch(err =>{
      return res.status(500).json({succes: false, message: 'Error arrete de faire de la merde !!!! '})
   })
})



routers.post('/', async (req, res)=>{
   const orderItemsIds = Promise.all(req.body.orderItems.map(async order =>{
      let nouOrItem = new OrderItems({
         quantity: order.quantity,
         product: order.product
      })
      nouOrItem = await nouOrItem.save();
      return nouOrItem.id; 
   }))

   const comItemIdsResolve = await orderItemsIds;

   const prixTotal = await Promise.all(comItemIdsResolve.map(async orderItId =>{
      const orderItem = await OrderItems.findById(orderItId).populate('product', 'price');
      const prix = orderItem.product.price * orderItem.quantity; 
      return prix; 
   }))
   
   const som = Number(prixTotal);

   let nouvOrder = new Order ({
       orderItems: comItemIdsResolve,
       shippingAddresse1: req.body.shippingAddresse1,
       shippingAddresse2: req.body.shippingAddresse2,
       city: req.body.city,
       country: req.body.country,
       phone: req.body.phone,
       status: req.body.status,
       zip: req.body.zip,
       totalPrice: som,
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


/////////// mise a jour de la commande /////////
routers.put('/:id' , async (req,res)=>{
   let orderUp = await Order.findByIdAndUpdate(
       req.params.id,
           {
            status: req.body.status 
           },
           {new : true}
       )
   if(!orderUp){
       return res.status(404).json({succes: false, message: 'aucune commande trouve !!'})
   }else{
       return res.status(200).json({succes: true, orderUp})
   }
})

////////// savoir la somme de la vente total grace au commmande/////////
routers.get('/get/ventetotal', async(req, res)=>{
   const venTo = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
   ])
   if(!venTo){
      return res.status(400).json({succes: false, message: 'La somme total ne peut pas etre genere'})
   }else{
      return res.status(200).send({totalVente:  venTo.pop().total})
   }
})


///////// savoir le nombre de commmande ////////////////
routers.get('/get/count', async (req, res)=>{
   let orderCount = await Order.countDocuments({})
   if(!orderCount){
       return res.status(404).json({succes: false, mesage: 'le produit n\'existe pas' })
   }else{
       res.send({
           count: orderCount
       })
   }
})


///// recureper les commmandes faites par les utilisateurs ///////////
routers.get('/get/usersorders/:userid', async(req, res)=>{
   const orderUserList = await Order.find({user: req.params.userid})
   .populate({
      path: 'orderItems', populate: {
         path: 'product', populate: 'category'
      }
   }).sort({dateOrdered: -1})
   if(!orderUserList){
      return res.status(404).json({succes: false, message: 'order not found'})
   }else{
      return res.status(202).json({succes: true, orderUserList })
   }
})




module.exports = routers;