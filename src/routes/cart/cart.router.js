

const {httpAddProductToCart, httpDeleteCartProduct, httpUpdateQuantity, httpGetCartByUserId} = require('./cart.controller');
const express = require('express');

const Cart = express.Router();

Cart.post('/', httpAddProductToCart);
Cart.get('/:userId', httpGetCartByUserId);
Cart.post('/update', httpUpdateQuantity);
Cart.post('/delete', httpDeleteCartProduct);

module.exports = Cart;