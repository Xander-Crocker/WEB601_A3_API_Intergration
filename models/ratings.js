const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    product_id: {
        type: String,
    },
    rating: {
        type: Number,
    },
    review: {
        type: String,
    }
})

module.exports = mongoose.model('Ratings', ratingSchema);