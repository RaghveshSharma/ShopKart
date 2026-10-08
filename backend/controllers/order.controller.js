import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user._id;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: "Valid shipping address is required" });
    }

    const customer = await Customer.findById(userId);
    if (!customer || !customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and calculate total
    for (const item of customer.cart) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: "One or more products in cart no longer exist." });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // Create pending ShopKart order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    await newOrder.save();

    // Create Razorpay order
    const amountInPaise = Math.round(totalAmount * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: newOrder._id.toString()
    });

    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    return res.status(200).json({
      success: true,
      shopKartOrderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Order creation error:", error);
    const errorMsg = error.error?.description || error.message || "An unexpected error occurred during order creation";
    return res.status(500).json({ success: false, message: "Server error", error: errorMsg });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: shopKartOrderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay order ID" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Payment is valid
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Decrease product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Customer.findByIdAndUpdate(userId, { $set: { cart: [] } });

    return res.status(200).json({ success: true, message: "Payment verified and order placed", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid order ID format" });
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
