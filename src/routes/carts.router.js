import { Router } from "express";
import passport from "passport";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();


router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.status(201).send(cart);
});


router.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }), 
  authorization("user"),                            
  async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send({ status: "error", message: "Carrito no encontrado" });

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).send({ status: "error", message: "Producto no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) existing.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    res.send(cart);
  }
);

router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product");

    if (!cart) {
      return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
    }

    res.send(cart);
  }
);

export default router;