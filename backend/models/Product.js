import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    variants: { type: Object, default: {} },
    description: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Draft"], default: "Active" },

    // Denormalized counters, updated as orders/views/favorites happen
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
