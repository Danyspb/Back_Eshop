const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    quantity:{
        type: Number,
        require: true,
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

exports.OrderItems = mongoose.model('OrderItems', orderItemSchema)
