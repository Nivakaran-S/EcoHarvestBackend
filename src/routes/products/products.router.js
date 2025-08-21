const express = require("express");

const {
  httpCreateProduct,
  httpSearchProduct,
  httpGetProductById,
  httpGetProductByCategoryId,
  getProducts,
  updateProduct,
  deleteProduct,
  httpGetAllRecycleProducts,
} = require("./products.controller");

const router = express.Router();
router.get("/read", httpGetAllRecycleProducts);
router.get("/category/:categoryId", httpGetProductByCategoryId);

router.post("/", httpCreateProduct);
router.get("/", getProducts);
router.get("/:id", httpGetProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/search", httpSearchProduct);

module.exports = router;
