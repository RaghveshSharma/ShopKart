import express from "express";
import {
    registerCustomer,
    loginCustomer,
    getMyProfile,
    logoutCustomer,
    j
} from "../controllers/customer.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected Routes
router.get("/me", protectRoute, getMyProfile);
router.get("/j", j)
router.post("/logout", protectRoute, logoutCustomer);

 
export default router;
