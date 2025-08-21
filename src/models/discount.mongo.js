const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    percentage: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
