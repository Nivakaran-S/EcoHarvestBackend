
const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{  
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            default: 1,
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
    }], 
    totalAmount: {
        type: Number,
        required: true, 
 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Cart', cartsSchema);