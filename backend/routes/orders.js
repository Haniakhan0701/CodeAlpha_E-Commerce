import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — place an order from the current cart
router.post("/", requireAuth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const user = await User.findById(req.userId).populate({
      path: "cart.product",
      populate: { path: "shop" },
    });

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const items = user.cart.map((item) => ({
      product: item.product._id,
      shop: item.product.shop._id,
      title: item.product.title,
      price: item.product.price,
      variants: item.variants,
      qty: item.qty,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = 6.5;
    const total = subtotal + shipping;

    const order = await Order.create({
      buyer: req.userId,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total,
    });

    // Update order counts on each product
    for (const item of items) {
      await user.constructor.db.model("Product").findByIdAndUpdate(item.product, { $inc: { ordersCount: item.qty } });
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders — the logged-in buyer's own order history
router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/orders/:id/status — seller updates order status (Processing -> Shipped -> Delivered)
router.put("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
