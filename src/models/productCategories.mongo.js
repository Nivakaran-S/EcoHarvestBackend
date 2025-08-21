
const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    tag : {
        type: String,
        required: true,
        enum: ['Resell', 'Recycle'],
    }, 
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports= mongoose.model('ProductCategory', productCategorySchema);