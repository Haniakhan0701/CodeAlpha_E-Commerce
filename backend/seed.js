import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Shop from "./models/Shop.js";
import Product from "./models/Product.js";

dotenv.config();

function img(seed, n = 600) {
  return `https://picsum.photos/seed/${seed}/${n}/${n}`;
}

const SHOPS = [
  { name: "Willow & Wren", bio: "Hand-stamped jewelry made in a small studio in Portland." },
  { name: "Studio Marlowe", bio: "Wheel-thrown ceramics and home goods, fired in small batches." },
  { name: "Fern & Field", bio: "Naturally dyed linen and wool clothing, made slowly and meant to last." },
  { name: "Paper Meadow", bio: "Original watercolor art and digital design goods." },
  { name: "Grainwood Co.", bio: "Small-batch woodworking — desk accessories carved from reclaimed hardwood." },
  { name: "Saddle & Stitch", bio: "Full-grain leather goods, hand-stitched with waxed thread." },
];

const PRODUCTS_BY_SHOP = {
  "Willow & Wren": [
    { title: "Hand-Stamped Copper Name Necklace", category: "Jewelry", price: 28.5, images: [img("necklace1"), img("necklace1b")], variants: { Metal: ["Copper", "Silver"], Length: ["16\"", "18\""] }, description: "A delicate hand-stamped necklace, personalized with the name of your choice." },
    { title: "Sterling Silver Stacking Rings (Set of 3)", category: "Jewelry", price: 45, images: [img("rings1"), img("rings1b")], variants: { Size: ["6", "7", "8"] }, description: "A set of three thin stacking rings in sterling silver." },
  ],
  "Studio Marlowe": [
    { title: "Ceramic Table Lamp, Speckled Glaze", category: "Home Decor", price: 96, images: [img("lamp1"), img("lamp1b")], variants: { Glaze: ["Speckled Cream", "Sage Green"] }, description: "Wheel-thrown ceramic base with a warm linen shade." },
    { title: "Stoneware Dinner Bowl Set (4)", category: "Home Decor", price: 72, images: [img("bowls1"), img("bowls1b")], variants: { Glaze: ["Speckled Cream", "Sage Green"] }, description: "A set of four wheel-thrown stoneware bowls." },
  ],
  "Fern & Field": [
    { title: "Linen Wrap Dress, Hand-Dyed", category: "Clothing", price: 74, images: [img("dress1"), img("dress1b")], variants: { Size: ["S", "M", "L"], Color: ["Terracotta", "Sage"] }, description: "100% linen wrap dress, hand-dyed in small batches." },
    { title: "eBook: A Slow Maker's Year", category: "Ebooks", price: 14, images: [img("ebook1"), img("ebook1b")], variants: { Format: ["EPUB", "PDF"] }, description: "A 220-page seasonal guide to slow, handmade living." },
  ],
  "Paper Meadow": [
    { title: "Watercolor Botanical Print Set (3)", category: "Art & Prints", price: 32, images: [img("prints1"), img("prints1b")], variants: { Size: ["8x10\"", "11x14\""] }, description: "A set of three original watercolor botanical prints." },
    { title: "Watercolor Texture Brush Pack (Procreate)", category: "Digital Products", price: 12, images: [img("brushpack1"), img("brushpack1b")], variants: { License: ["Personal", "Commercial"] }, description: "40 hand-painted watercolor brushes for Procreate, instant download." },
    { title: "Printable Budget Planner (PDF)", category: "Digital Products", price: 8, images: [img("plannerpdf1"), img("plannerpdf1b")], variants: { Format: ["Letter", "A4"] }, description: "A 12-month printable budget planner, instant download." },
  ],
  "Grainwood Co.": [
    { title: "Handmade Walnut Wood Phone Stand", category: "Electronics", price: 22, images: [img("phonestand1"), img("phonestand1b")], variants: { Wood: ["Walnut", "Maple"] }, description: "A minimalist phone stand carved from solid walnut." },
    { title: "Minimalist Wall Clock, Walnut", category: "Home Decor", price: 54, images: [img("clock1"), img("clock1b")], variants: { Wood: ["Walnut", "Oak"] }, description: "A silent-movement wall clock with a solid walnut face." },
  ],
  "Saddle & Stitch": [
    { title: "Leather Passport Holder, Embossed", category: "Craft Supplies", price: 34, images: [img("passport1"), img("passport1b")], variants: { Leather: ["Cognac", "Black"] }, description: "Full-grain leather passport holder, hand-stitched." },
    { title: "eBook: The Independent Shop Owner's Guide", category: "Ebooks", price: 16, images: [img("ebook2"), img("ebook2b")], variants: { Format: ["EPUB", "PDF"] }, description: "A practical guide to pricing, photographing, and shipping handmade goods." },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB — seeding...");

  await Promise.all([User.deleteMany({}), Shop.deleteMany({}), Product.deleteMany({})]);
  console.log("Cleared existing Users, Shops, Products.");

  const defaultPassword = await bcrypt.hash("password123", 10);

  for (const shopInfo of SHOPS) {
    const ownerEmail = shopInfo.name.toLowerCase().replace(/[^a-z]/g, "") + "@kraftly-demo.com";
    const owner = await User.create({
      name: shopInfo.name + " Owner",
      email: ownerEmail,
      password: defaultPassword,
      role: "seller",
    });

    const shop = await Shop.create({
      name: shopInfo.name,
      bio: shopInfo.bio,
      owner: owner._id,
      banner: img(shopInfo.name.replace(/\s/g, "") + "-banner", 1200),
    });

    owner.shop = shop._id;
    await owner.save();

    const products = PRODUCTS_BY_SHOP[shopInfo.name] || [];
    for (const p of products) {
      await Product.create({ ...p, shop: shop._id });
    }

    console.log(`Seeded shop "${shop.name}" with ${products.length} products (login: ${ownerEmail} / password123)`);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
