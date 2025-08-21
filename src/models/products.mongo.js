const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Resell", "Recycling", "Fertilizer"],
    required: true,
  },

  productCategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "In Stock",
  },
  MRP: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
