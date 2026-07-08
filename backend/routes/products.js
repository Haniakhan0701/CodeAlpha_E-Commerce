import express from "express";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import Review from "../models/Review.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// GET /api/products?category=Jewelry&search=necklace
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { status: "Active" };
    if (category && category !== "All") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const products = await Product.find(filter).populate("shop", "name").sort({ createdAt: -1 });

    res.json({
      products: products.map((p) => ({
        id: p._id,
        title: p.title,
        category: p.category,
        shop: p.shop.name,
        shopId: p.shop._id,
        price: p.price,
        images: p.images,
        variants: p.variants,
        rating: 4.7, // placeholder until reviews are aggregated below is used on the detail page instead
        reviewCount: 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id — full detail including reviews + rating
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop", "name bio banner");
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.views += 1;
    await product.save();

    const reviews = await Review.find({ product: product._id }).populate("author", "name");
    const avgRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    res.json({
      product: {
        id: product._id,
        title: product.title,
        category: product.category,
        shop: product.shop.name,
        shopId: product.shop._id,
        price: product.price,
        images: product.images,
        variants: product.variants,
        description: product.description,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
        reviews: reviews.map((r) => ({ id: r._id, author: r.author.name, rating: r.rating, text: r.text })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products — create a listing (seller only, requires a shop)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, category, price, images, variants, description, shopId } = req.body;
    if (!title || !category || !price || !shopId) {
      return res.status(400).json({ message: "Title, category, price, and shopId are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only add listings to your own shop" });
    }

    const product = await Product.create({
      title, category, price, images: images || [], variants: variants || {}, description: description || "", shop: shopId,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/products/:id — update (owner only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop", "owner");
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.shop.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id — owner only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop", "owner");
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.shop.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await product.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
