
const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,

    },
    address: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Company', CompanySchema)

