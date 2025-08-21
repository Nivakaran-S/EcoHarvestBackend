const Discount = require("./discount.mongo");
const Product = require("./products.mongo");

async function createDiscount(data) {
  const product = await Product.findById(data.productId);
  if (!product) {
    throw new Error("Product not found");
  }

  console.log(data.percentage);
  return await Discount.create({
    percentage: data.percentage,

    status: data.status,

    productId: data.productId,
  });
}

async function deleteDiscount(id) {
  if (!id) {
    throw new Error("Discount ID is required to delete");
  }

  try {
    const deletedDiscount = await Discount.findByIdAndDelete(id);

    if (!deletedDiscount) {
      throw new Error("Discount not found");
    }

    return deletedDiscount;
  } catch (err) {
    console.error("Error deleting discount:", err.message);
    throw new Error("Failed to delete discount: " + err.message);
  }
}
async function updateDiscount(data) {
  if (!data.id) {
    throw new Error("Discount ID is required to update");
  }

  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(
      data.id,
      {
        percentage: data.percentage,

        status: data.status,
        productId: data.productId,
      },
      { new: true, upsert: false }
    );

    if (!updatedDiscount) {
      throw new Error("Discount not found");
    }

    return updatedDiscount;
  } catch (err) {
    console.error("Error updating discount:", err.message);
    throw new Error("Failed to update discount: " + err.message);
  }
}
async function getAllDiscount() {
  return await Discount.find({}).populate("productId");
}

module.exports = {
  createDiscount,
  deleteDiscount,
  updateDiscount,
  getAllDiscount,
};
