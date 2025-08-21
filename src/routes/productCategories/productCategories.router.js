
const {httpCreateProductCategory, httpGetAllProductCategories} = require('./productCategories.controller');

const express = require('express');
const productCategoriesRouter = express.Router();

productCategoriesRouter.get('/', httpGetAllProductCategories);
productCategoriesRouter.post('/productcategory', httpCreateProductCategory);

module.exports = productCategoriesRouter;