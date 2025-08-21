const Product = require("../../models/products.model");
const Products = require("../../models/products.mongo");
const {
  getProductByCategoryId,
  searchProducts,
  getProductById,
  createProduct,
  getRecycleProducts,
  //getProductsByEnumCategory,
} = require("../../models/products.model");

const httpSearchProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.searchTerm) {
      return res
        .status(400)
        .json({ message: "Search term and Category is required" });
    }

    const products = await searchProducts(data);
    if (!products)
      return res.status(404).json({ message: "No products found" });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in searching product", err);
    res.status(500).json({ message: err.message });
  }
};
// const httpGetRecycleProducts = async (req, res) => {
//   const category = "Recycle";
//   const products = await getProductsByEnumCategory(category);

//   res.status(200).json({
//     success: true,
//     data: products,
//   });
// };
const httpGetProductByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const products = await getProductByCategoryId(categoryId);
    if (!products)
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in getting product by category ID", err);
    res.status(500).json({ message: err.message });
  }
};

const httpGetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received product ID:", id);
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const productDetails = await getProductById(id);

    return res.status(200).json(productDetails);
  } catch (err) {
    console.error("Error in getting product by ID", err);
    return res.status(500).json({ message: err.message });
  }
};

const httpCreateProduct = async (req, res) => {
  try {
    const {
      name,
      subtitle,
      quantity,
      unitPrice,
      category,
      productCategory_id,
      imageUrl,
      status,
      MRP,  
      vendorId,
    } = req.body;
    if (
      !name ||
      !subtitle ||
      !quantity ||
      !unitPrice ||
      !category ||
      !productCategory_id ||
      !imageUrl ||
      !MRP ||
      !vendorId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      typeof quantity !== "number" ||
      typeof unitPrice !== "number" ||
      typeof MRP !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Quantity, Unit Price, and MRP must be numbers" });
    }

    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error in creating product", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const httpGetAllRecycleProducts = async (req, res) => {
  try {
    return res.status(200).send(await getRecycleProducts());
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error in getting all Products", error: err.message });
  }
};

module.exports = {
  httpCreateProduct,
  httpSearchProduct,
  httpGetProductByCategoryId,
  getProducts,
  httpGetProductById,
  updateProduct,
  deleteProduct,
  httpGetAllRecycleProducts,
  //httpGetRecycleProducts,
};
