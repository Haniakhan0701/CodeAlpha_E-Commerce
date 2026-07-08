import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// POST /api/favorites/:productId — toggle favorite
router.post("/:productId", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { productId } = req.params;
    const isFavorite = user.favorites.some((id) => id.toString() === productId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== productId);
      await Product.findByIdAndUpdate(productId, { $inc: { favoritesCount: -1 } });
    } else {
      user.favorites.push(productId);
      await Product.findByIdAndUpdate(productId, { $inc: { favoritesCount: 1 } });
    }

    await user.save();
    res.json({ favorited: !isFavorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/favorites — the logged-in user's favorite product ids
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
