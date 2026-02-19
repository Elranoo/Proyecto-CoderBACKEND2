import { Router } from "express";
import passport from "passport";
import { CartModel } from "../models/cart.model.js";
import PurchaseService from "../services/purchase.service.js";

const router = Router();
const purchaseService = new PurchaseService();

router.post(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cart = await CartModel.findById(req.params.cid).populate("products.product");
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

      const ticket = await purchaseService.purchase(cart.products, req.user.email);


      res.status(200).json(ticket);

    } catch (error) {
      res.status(500).json({ error: "Error en la compra" });
    }
  }
);

export default router;