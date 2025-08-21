const products = require("./products.mongo");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const ProductCategory = require("./productCategories.mongo");

const getAllProducts = async () => {
  try {
    const productsList = await products.find({});
    return productsList;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductsByCategory = async (category) => {
  try {
    const productsList = await products.find({ productCategory_id: category });
    return productsList;
  } catch (err) {
    console.error("Error fetching products by category:", err);
  }
};
// const getProductsByEnumCategory = async (category) => {
//   try {
//     if (!category) {
//       throw new Error("Category name is required");
//     }

//     const validCategories = ["Recycle", "Fertilizer", "Sellable"];
//     const trimmedCategory = category.trim();

//     if (!validCategories.includes(trimmedCategory)) {
//       throw new Error("Invalid category name");
//     }

//     const productList = await products.find({ category: trimmedCategory });

//     return productList;
//   } catch (err) {
//     console.error("Error fetching products by category name:", err.message);
//     return [];
//   }
// };

const getProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const productDetails = await products.find(
      new mongoose.Types.ObjectId(productId)
    );

    return productDetails;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
  }
};

const getProductByCategoryId = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const trimmedCategoryId = categoryId.trim();

    if (!mongoose.Types.ObjectId.isValid(trimmedCategoryId)) {
      throw new Error("Invalid category ID");
    }

    const productlist = await products.find({
      productCategory_id: new mongoose.Types.ObjectId(trimmedCategoryId),
    });

    return productlist;
  } catch (err) {
    console.error("Error fetching product by category ID:", err);
    return [];
  }
};

const searchProducts = async (data) => {
  try {
    let categoryId;

    if (!data?.searchTerm?.trim()) {
      throw new Error("Search term is required");
    }

    if (data.categoryN) {
      const escapedCategoryName = data.categoryN;
      const category = await ProductCategory.findOne({
        name: escapedCategoryName,
      });

      if (!category) {
        throw new Error(`Category "${data.categoryN}" not found`);
      }
      categoryId = category._id;
    }

    return await products.find({
      name: {
        $regex: data.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        $options: "i",
      },
      ...(data.categoryN && {
        productCategory_id: categoryId,
      }),
    });
  } catch (error) {
    console.error("Search error:", error);
    throw new Error(`Search failed: ${error.message}`);
  }
};

const createProduct = async (data) => {
  const product = await products.create(data);
  return product;
};
const getRecycleProducts = async () => {
  try {
    const recycleProducts = await products.find({ category: "Recycling" });
    return recycleProducts;
  } catch (error) {
    console.error("Error fetching recycle products:", error);
  }
};
module.exports = {
  getProductByCategoryId,
  createProduct,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getRecycleProducts,
  //getProductsByEnumCategory,
};
