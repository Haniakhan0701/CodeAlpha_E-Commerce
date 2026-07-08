import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variants: { type: Object, default: {} },
    qty: { type: Number, default: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },

    // Buyer-side state
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    followedShops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
    cart: [cartItemSchema],

    // Seller-side link — set once a user creates a shop
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
