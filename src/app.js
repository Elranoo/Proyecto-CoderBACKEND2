import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";

import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import purchaseRouter from "./routes/purchase.router.js";

import { initializePassport } from "./config/passport.config.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use(express.static("public"));

app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/purchase", purchaseRouter);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB conectada"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 8080, () => {
  console.log("Servidor funcionando");
});