const mongoose = require('mongoose')

const lineItemSchema = new mongoose.Schema({
    product_id: {
        type: String,
    },
    title: {
        type: String,
    },
    variant_id: {
        type: Number,
    },
    variant_name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    _id: false
})

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    line_items: [lineItemSchema],
    total: {
        type: Number,
    }
})


module.exports = mongoose.model('Cart', cartSchema)