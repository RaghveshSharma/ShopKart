import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customer = req.user;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            // Exists, increment
            if (customer.cart[cartItemIndex].quantity + 1 > product.stock) {
                return res.status(400).json({ success: false, message: "Quantity exceeds stock" });
            }
            customer.cart[cartItemIndex].quantity += 1;
        } else {
            // New item
            if (product.stock < 1) {
                return res.status(400).json({ success: false, message: "Out of stock" });
            }
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();
        
        // Return populated cart
        const updatedCustomer = await Customer.findById(customer._id).populate("cart.product");

        return res.status(200).json({ success: true, message: "Cart updated", cart: updatedCustomer.cart });

    } catch (error) {
        console.error("Error in addToCart: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId).populate("cart.product");
        
        return res.status(200).json({ success: true, cart: customer.cart });
    } catch (error) {
        console.error("Error in getCart: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customer = req.user;

        if (quantity < 1 || isNaN(quantity)) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: "Quantity exceeds stock" });
        }

        const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        customer.cart[cartItemIndex].quantity = quantity;
        await customer.save();
        
        const updatedCustomer = await Customer.findById(customer._id).populate("cart.product");

        return res.status(200).json({ success: true, cart: updatedCustomer.cart });
    } catch (error) {
        console.error("Error in updateQuantity: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customer = req.user;

        customer.cart = customer.cart.filter(item => item.product.toString() !== productId);
        await customer.save();
        
        const updatedCustomer = await Customer.findById(customer._id).populate("cart.product");

        return res.status(200).json({ success: true, cart: updatedCustomer.cart });
    } catch (error) {
        console.error("Error in removeFromCart: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
