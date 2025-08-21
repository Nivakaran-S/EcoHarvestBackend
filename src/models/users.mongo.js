

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true   
    },
    password: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role',
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Customer', 'Admin', 'Vendor'],   
    },
    createdTimestamp: {
        default: Date.now(),
        type: Date
    }
})

module.exports = mongoose.model('User', userSchema);