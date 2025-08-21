const mongoose = require('mongoose');

const fertilizercompanySchema = new mongoose.Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    businessName: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    });
    
    const Fertilizercompany = mongoose.model('Fertilizercompany', fertilizercompanySchema );
    module.exports = Fertilizercompany;
