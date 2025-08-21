const express = require("express");
const {
  httpCreateDicount,
  httpDeleteDiscount,
  httpUpdateDiscount,
  httpGetAllDiscounts,
} = require("./discount.controller");
const DiscountRouter = express.Router();
DiscountRouter.post("/create", httpCreateDicount);
DiscountRouter.delete("/delete/:id", httpDeleteDiscount);
DiscountRouter.put("/update/:id", httpUpdateDiscount);
DiscountRouter.get("/", httpGetAllDiscounts);
module.exports = DiscountRouter;
