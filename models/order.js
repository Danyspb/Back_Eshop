const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItems',
        required: true
    }],
    shippingAddresse1: {
        type: String,
        required: true

    },
    shippingAddresse2: {
        type: String,

    },
    city: {
        type: String,
        required: true

    },
    zip: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true

    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    }
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON',{
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema)