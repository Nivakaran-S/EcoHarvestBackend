
const { getAllOrders, getOrderHistory, deleteOrder, updateOrder, createOrder, checkoutOrder, getAllOrdersByVendor } = require('../../models/orders.model')


async function httpGetOrderHistory(req, res) {
    try {
        const rawUserId = req.params.userId;
        const userId = rawUserId.replace(/^:/, '');
        return res.status(200).json(await getOrderHistory(userId));
    } catch(err) {
        console.error("Error in getting order history", err);
    }
}

async function httpGetAllOrders(req, res) {
    try {
        return res.status(200).json(await getAllOrders());
    } catch(err) {
        console.error("Error in getting all orders", err);
    }
}

async function httpCheckoutOrder(req, res) {
    try {
        return res.status(200).json(await checkoutOrder(req.body));
    } catch(err) {
        console.error("Error in checking out order", err);
    }
}

async function httpCreateOrder(req, res) {
    try{
        return res.status(200).json(await createOrder(req.body));
    } catch(err) {
        console.error("Error in creating order", httpCreateOrder)
    }
}

async function httpDeleteOrder(req, res) {
    try {
        return res.status(200).json(await deleteOrder(req.body))
    } catch(err) {
        console.error("Error in deleting order", err)
    }
}

async function httpUpdateOrder(req, res) {
    try {
        return res.status(200).json(await updateOrder(req.body))
    } catch(err) {
        console.error("Error in updating order", err)
    }
}


async function httpGetOrdersByVendor(req, res) {
  try {
    const vendorId = req.params.vendorId;
    const orders = await getAllOrdersByVendor(vendorId);
    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error getting vendor orders", err);
    return res.status(500).json({ error: "Failed to fetch vendor orders" });
  }
}



module.exports = {
    httpCreateOrder,
    httpUpdateOrder,
    httpDeleteOrder,
    httpGetAllOrders,
    httpCheckoutOrder,
    httpGetOrdersByVendor,
    httpGetOrderHistory
};
