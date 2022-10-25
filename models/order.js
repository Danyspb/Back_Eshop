const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
    },
    image: String,
    quantity:{
        type: Number,
        required: true
    }
})

exports.Order = mongoose.model('Order', orderSchema)