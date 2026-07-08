import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String, default: "A small independent shop on Kraftly." },
    banner: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
