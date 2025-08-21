
const Cart = require('./cart.mongo');
const Product = require('./products.mongo');


const updateQuantity = async (cartId, productId, updatedQuantity) => {
    try {
 
        if (updatedQuantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

      
        const product = await Product.findById(productId).select('unitPrice');
        if (!product) {
            throw new Error('Product not found');
        }
        const currentPrice = product.unitPrice;

       
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

    
        const existingProduct = cart.products.find(p => 
            p.productId.toString() === productId.toString()
        );

        if (!existingProduct) {
            throw new Error('Product not found in cart');
        }

      
        existingProduct.quantity = updatedQuantity;
        existingProduct.price = currentPrice; 

        
        cart.totalAmount = cart.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        return cart;

    } catch (error) {
        console.error('Error updating quantity:', error);
        throw error;
    }
};

const addProductToCart = async (userId, quantity, productId) => {
    try {
        
        const product = await Product.findById(productId).select('unitPrice');
        if (!product) {
            throw new Error('Product not found');
        }
        const price = product.unitPrice;

        
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            
            const newCart = new Cart({
                userId,
                products: [{
                    productId,
                    quantity,
                    price 
                }],
                totalAmount: price * quantity
            });
            await newCart.save();
            return newCart;
        } else {
            
            const existingProduct = cart.products.find(p => 
                p.productId.toString() === productId.toString()
            );

            if (existingProduct) {
                
                existingProduct.quantity += quantity;
                existingProduct.price = price; // Update to current price
            } else {
                
                cart.products.push({
                    productId,
                    quantity,
                    price
                });
            }


            cart.totalAmount = cart.products.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            await cart.save();
            return cart;
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
};

const deleteCartProduct = async (cartId, productId) => {
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return "Cart not found"
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === String(productId));
        if (productIndex === -1) {
            return ('Product not found in cart');
        }

        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    } catch(err) {
        console.error('Error deleting product from cart:', err);
    }
}

const getCartByUserId = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId });

        const products = await Product.find({ _id: { $in: cart.products.map(p => p.productId) } });
        return {cart, products};
    } catch (error) {
        console.error('Error fetching cart by user ID:', error);
        
    }
}

module.exports = {
    addProductToCart,
    getCartByUserId,
    updateQuantity,
    deleteCartProduct
    
}

