import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist, toggleWishlist, getTwo } from "../controllers/wishlist.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/two", protectRoute, getTwo);
router.post("/:productId", protectRoute, addToWishlist);
router.get("/", protectRoute, getWishlist);
router.delete("/:productId", protectRoute, removeFromWishlist);
router.patch("/:productId/toggle", protectRoute, toggleWishlist);

export default router;
