import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  owner: { type: String, default: "admin" }
});

export const ProductModel = mongoose.model("Products", productSchema);