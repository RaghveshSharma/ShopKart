import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        customer.wishlist.push(productId);
        await customer.save();

        return res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Task 3: Get Current User's Wishlist
export const getWishlist = async (req, res) => {
    try {
        const customerId = req.user._id;
        
        const customer = await Customer.findById(customerId).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Task 4: Remove Product from Wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const customer = await Customer.findById(customerId);
        
        if (!customer.wishlist.includes(productId)) {
            return res.status(404).json({ success: false, message: "Product not in wishlist" });
        }

        customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId.toString());
        await customer.save();

        return res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Bonus: Toggle Wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        
        const index = customer.wishlist.indexOf(productId);
        let isSaved = false;

        if (index > -1) {
            // Remove
            customer.wishlist.splice(index, 1);
        } else {
            // Add
            customer.wishlist.push(productId);
            isSaved = true;
        }

        await customer.save();
        return res.status(200).json({ success: true, saved: isSaved });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getTwo = async (req, res) => {
    try {
        const customerId = req.user._id;
        
        const customer = await Customer.findById(customerId).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        const twoItems = customer.wishlist.slice(0, 2);

        return res.status(200).json({
            success: true,
            count: twoItems.length,
            wishlist: twoItems
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
