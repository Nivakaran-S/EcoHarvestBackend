const express = require("express");

const { httpGetAllOrders, httpGetOrderHistory, httpCheckoutOrder, httpCreateOrder, httpDeleteOrder, httpUpdateOrder, httpGetOrdersByVendor } = require('./orders.controller')


const OrdersRouter = express.Router()

OrdersRouter.get('/vendor/:vendorId', httpGetOrdersByVendor);
OrdersRouter.get('/', httpGetAllOrders);
OrdersRouter.post('/create', httpCreateOrder);
OrdersRouter.post('/update', httpUpdateOrder);
OrdersRouter.delete('/:id', httpDeleteOrder);
OrdersRouter.post('/checkout', httpCheckoutOrder);
OrdersRouter.get('/history/:userId', httpGetOrderHistory);


module.exports = OrdersRouter;
