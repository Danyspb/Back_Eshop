const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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

exports.Product = mongoose.model('User', productSchema)