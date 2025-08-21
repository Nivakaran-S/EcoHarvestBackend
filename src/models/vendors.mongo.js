const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    businessName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String },
});

module.exports = mongoose.model("Vendor", vendorSchema);
