import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// Task 1 — Register a Customer
export const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Validation Rules
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are mandatory" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
        }

        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new customer
        const newCustomer = new Customer({
            fullName,
            email,
            password: hashedPassword,
            phone
        });

        if (newCustomer) {
            await newCustomer.save();

            res.status(201).json({
                success: true,
                message: "Customer registered successfully",
                customer: {
                    _id: newCustomer._id,
                    fullName: newCustomer.fullName,
                    email: newCustomer.email,
                    phone: newCustomer.phone
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid customer data" });
        }

    } catch (error) {
        console.error("Error in registerCustomer controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Task 2 — Login
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        // Compare password (will be false if customer is null)
        const isPasswordCorrect = await bcrypt.compare(password, customer?.password || "");

        if (!customer || !isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT and set it in HttpOnly cookie
        generateToken(customer._id, res);

        res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error("Error in loginCustomer controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Task 3 — My Profile
export const getMyProfile = async (req, res) => {
    try {
        // req.user is attached by auth.middleware.js
        const customer = await Customer.findById(req.user._id).select("-password");

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json(customer);

    } catch (error) {
        console.error("Error in getMyProfile controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Task 4 — Logout
export const logoutCustomer = async (req, res) => {
    try {
        // Clear the cookie
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error("Error in logoutCustomer controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const j = async(req, res) => {
    res.status(200).json({success: true, message: "Hi j"})
}