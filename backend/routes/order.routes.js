import express from "express";
import { createPaymentOrder, verifyPayment, getOrders, getOrderById } from "../controllers/order.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-payment-order", protectRoute, createPaymentOrder);
router.post("/verify-payment", protectRoute, verifyPayment);
router.get("/", protectRoute, getOrders);
router.get("/:id", protectRoute, getOrderById);

export default router;
