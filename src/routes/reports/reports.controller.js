const Order = require('../../models/orders.mongo');
const Product = require('../../models/products.mongo');
const { generateAllOrdersPDF } = require('../../models/pdf.model');
const mongoose = require('mongoose');

const generateSalesReport = async (req, res) => {
    const vendorId = new mongoose.Types.ObjectId(req.params.vendorId);

  try {
    const salesData = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.vendorId": vendorId } },
      {
        $group: {
          _id: "$products.productId",
          productName: { $first: "$productDetails.name" },
          totalQuantitySold: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.unitPrice"] } },
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      message: "Sales report generated",
      data: salesData
    });
  } catch (err) {
    console.error("Error generating sales report", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { generateSalesReport };
