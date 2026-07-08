import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    title: String,
    price: Number,
    variants: { type: Object, default: {} },
    qty: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      zip: String,
      country: String,
    },
    subtotal: Number,
    shipping: Number,
    total: Number,
    status: { type: String, enum: ["Processing", "Shipped", "Delivered"], default: "Processing" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);