import { Router } from "express";
import passport from "passport";
import { CartModel } from "../models/cart.model.js";
import PurchaseService from "../services/purchase.service.js";

const router = Router();
const purchaseService = new PurchaseService();

router.post("/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cart = await CartModel.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const ticket = await purchaseService.purchase(cart.products, req.user.email);
    res.send({ status: "success", ticket });
  }
);

export default router;