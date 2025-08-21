
const { addProductToCart, deleteCartProduct, updateQuantity, getCartByUserId} = require('../../models/cart.model');


const httpUpdateQuantity = async (req, res) => {
    try {
        const { cartId, productId, updatedQuantity } = req.body;
        if (!cartId || !productId || !updatedQuantity) {
            return res.status(400).json({ message: 'Cart ID, Product ID and updated quantity are required' });
        }

        const updatedCart = await updateQuantity(cartId, productId, updatedQuantity);
        if (!updatedCart) return res.status(404).json({ message: 'Cart not found' });

        console.log("Updated cart", updatedCart)
        return res.status(200).json(updatedCart);
    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message });
        
    }
}

const httpDeleteCartProduct = async (req, res) => {
    try {
        const { cartId, productId } = req.body;
        if (!cartId || !productId) {
            return res.status(400).json({ message: 'Cart ID and Product ID are required' });
        }

        const updatedCart = await deleteCartProduct(cartId, productId);
        if (!updatedCart) return res.status(404).json({ message: 'Cart not found' });

        
        return res.status(200).json(updatedCart);

    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message });
        
    }
}

const httpAddProductToCart = async (req, res) => {
    try {
        const { userId, quantity, productId } = req.body;
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: 'User ID, quantity and Product ID are required' });
        }

        const cart = await addProductToCart(userId, quantity, productId);
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const httpGetCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const cart = await getCartByUserId(userId);
        if (!cart) return res.status(404).json({ message: 'Cart not found for this user' });
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart by user ID:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}


module.exports = {
    httpAddProductToCart,
    httpGetCartByUserId,
    httpUpdateQuantity,
    httpDeleteCartProduct
}