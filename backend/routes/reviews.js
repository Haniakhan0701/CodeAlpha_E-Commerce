import express from "express";
import Review from "../models/Review.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// POST /api/reviews — add a review to a product
router.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    if (!productId || !rating || !text) {
      return res.status(400).json({ message: "productId, rating, and text are required" });
    }

    const review = await Review.create({ product: productId, author: req.userId, rating, text });
    const populated = await review.populate("author", "name");

    res.status(201).json({
      review: { id: populated._id, author: populated.author.name, rating: populated.rating, text: populated.text },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
