
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    
    type: {
        type: String,
        required: true,
        enum: ['Individual', 'Company']
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type',
        required: true,
        
    },
    
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now()
    }


})


module.exports = mongoose.model('Customer', customerSchema)

