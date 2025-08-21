

const Orders = require('./orders.mongo');
const Cart = require('./cart.mongo')
const Product = require('./products.mongo')
const mongoose = require('mongoose')
const Vendor = require('./vendors.mongo')
const User = require('./users.mongo')


const getAllOrders = async () => {
    try {
        const orders = await Orders.find({})
        .populate({
            path: 'products.productId',
            model: 'Product',
            select: 'name'
        })
        .lean()

        return orders
    }
    catch (err) {
        console.log("Error in getting all orders", err)
        throw new Error("Failed to fetch orders");
    }
}

const createOrder = async (data) => {

    const numberOfOrders = await Orders.countDocuments()

    return await Orders.create({
        orderNumber: "ORD100" + (numberOfOrders+1),
        products : [{
            productId: data.productId,
            quantity: data.quantity,
            unitPrice: data.unitPrice
        }],
        orderTime: Date.now(),
        totalAmount: req.body.totalAmount,
        status: req.body.status
    })
}

const updateOrder = async (data) => {
    return await Orders.find({
        _id: data.id
    }, data, {
        upsert: true
    } )
}

const deleteOrder = async (id) => {
    return await Orders.deleteOne({
        _id: id
    })
}

const checkoutOrder = async (data) => {
    
    try {
        

        
        const checkoutCart = await Cart.find({_id: data.cart._id})

        if (!checkoutCart) throw new Error("Cart not found")

      
        console.log("Checkout Cart", checkoutCart)

        console.log("Total Amount", data.cart.totalAmount)
        orderNumber = "ORD100" + (await Orders.countDocuments() + 1);
        console.log("Order Number", orderNumber);

        
        const order = Orders.create({
            userId: data.cart.userId,
            orderNumber: orderNumber,
            products: checkoutCart[0].products.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price
            })),
            totalAmount: data.cart.totalAmount,
            status: "Pending Payment",
            
        })

        await Cart.deleteOne({
            _id: data.cart._id
        })

        return order
        
    } catch(err) {
        console.log("Error in creating order", err)        
    }

}

const getAllOrdersByVendor = async (vendorId) => {
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

  const productDocs = await Product.find({ vendorId: vendorObjectId });
  const productIds = productDocs.map((p) => p._id);

  const orders = await Orders.find({
    "products.productId": { $in: productIds }
  })
    .populate("products.productId")
    .populate("userId", "name email");

  return orders;
};
  
  const getProductIdsByVendor = async (vendorId) => {
    const products = await require('./products.mongo').find({ vendorId });
    return products.map(p => p._id);
  };


const getOrderHistory = (userId) => {
  return Orders.find({ userId: userId })
    .populate({
      path: 'products.productId',
      model: 'Product',
      select: 'name subtitle imageUrl unitPrice averageRating MRP images' // Fix: 'images' instead of 'image'
    })
    .sort({ orderTime: -1 }) // Add sorting by order time (newest first)
    .exec();
};
    

module.exports = {
    getAllOrders,
    deleteOrder,
    updateOrder,
    createOrder,
    checkoutOrder,
    getAllOrdersByVendor, 
    getOrderHistory
};