import { Router } from "express";
import passport from "passport";
import ProductService from "../services/product.service.js";
import ProductRepository from "../repositories/product.repository.js";
import ProductDAO from "../dao/product.dao.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();
const productService = new ProductService(new ProductRepository(new ProductDAO()));


router.get("/", async (req, res) => {
  const products = await productService.getProducts();
  res.send(products);
});


router.post(
  "/",
  passport.authenticate("jwt", { session: false }),   
  authorization("admin"),                             
  async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).send(product);
  }
);


router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    const updated = await productService.updateProduct(req.params.pid, req.body);
    res.send(updated);
  }
);


router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    await productService.deleteProduct(req.params.pid);
    res.send({ status: "success", message: "Producto eliminado" });
  }
);

export default router;