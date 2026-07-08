import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import shopRoutes from "./routes/shops.js";
import cartRoutes from "./routes/cart.js";
import favoriteRoutes from "./routes/favorites.js";
import reviewRoutes from "./routes/reviews.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Kraftly API is running");
});

const PORT = process.env.PORT || 5050;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
