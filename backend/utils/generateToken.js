import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    // Generate JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    // Set JWT as HttpOnly Cookie
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
        httpOnly: true, // Prevents XSS attacks
        sameSite: "none", // Must be "none" for cross-domain (Vercel -> Render)
        secure: true // Must be true when sameSite is "none"
    });
};

export default generateToken;
