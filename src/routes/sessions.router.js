import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/sessions.controller.js";
import { UserModel } from "../models/user.model.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    const user = await UserModel.findById(req.user._id)
      .populate("cart");  

    res.json(user);
  }
);



export default router;