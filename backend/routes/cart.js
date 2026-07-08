import express from "express";
import User from "../models/User.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// GET /api/cart — the logged-in user's cart, with product details populated
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cart — add an item
router.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, variants, qty } = req.body;
    const user = await User.findById(req.userId);
    user.cart.push({ product: productId, variants: variants || {}, qty: qty || 1 });
    await user.save();
    await user.populate("cart.product");
    res.status(201).json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/cart/:index — update quantity
router.put("/:index", requireAuth, async (req, res) => {
  try {
    const { qty } = req.body;
    const user = await User.findById(req.userId);
    const i = parseInt(req.params.index, 10);
    if (!user.cart[i]) return res.status(404).json({ message: "Cart item not found" });
    user.cart[i].qty = qty;
    await user.save();
    await user.populate("cart.product");
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart/:index — remove an item
router.delete("/:index", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const i = parseInt(req.params.index, 10);
    user.cart.splice(i, 1);
    await user.save();
    await user.populate("cart.product");
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
