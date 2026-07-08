import express from "express";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// POST /api/shops — create a shop (turns a buyer into a seller)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, bio, banner } = req.body;
    if (!name) return res.status(400).json({ message: "Shop name is required" });

    const existing = await Shop.findOne({ name });
    if (existing) return res.status(400).json({ message: "Shop name already taken" });

    const shop = await Shop.create({ name, bio, banner, owner: req.userId });
    await User.findByIdAndUpdate(req.userId, { shop: shop._id, role: "seller" });

    res.status(201).json({ shop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/shops/:name — shop profile + its products
router.get("/:name", async (req, res) => {
  try {
    const shop = await Shop.findOne({ name: decodeURIComponent(req.params.name) });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const products = await Product.find({ shop: shop._id, status: "Active" });

    res.json({
      shop: {
        id: shop._id,
        name: shop.name,
        bio: shop.bio,
        banner: shop.banner,
        followerCount: shop.followers.length,
        products: products.map((p) => ({
          id: p._id, title: p.title, price: p.price, images: p.images, category: p.category,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/shops/:id/follow — toggle follow
router.post("/:id/follow", requireAuth, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const user = await User.findById(req.userId);
    const isFollowing = user.followedShops.some((id) => id.toString() === shop._id.toString());

    if (isFollowing) {
      user.followedShops = user.followedShops.filter((id) => id.toString() !== shop._id.toString());
      shop.followers = shop.followers.filter((id) => id.toString() !== req.userId);
    } else {
      user.followedShops.push(shop._id);
      shop.followers.push(req.userId);
    }

    await user.save();
    await shop.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/shops/me/listings — the logged-in seller's own listings
router.get("/me/listings", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.shop) return res.json({ listings: [] });

    const listings = await Product.find({ shop: user.shop });
    res.json({ listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/shops/me/orders — orders containing this seller's products
router.get("/me/orders", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.shop) return res.json({ orders: [] });

    const orders = await Order.find({ "items.shop": user.shop }).populate("buyer", "name").sort({ createdAt: -1 });

    res.json({
      orders: orders.map((o) => ({
        id: o._id,
        buyer: o.buyer.name,
        items: o.items.filter((i) => i.shop.toString() === user.shop.toString()),
        status: o.status,
        createdAt: o.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
