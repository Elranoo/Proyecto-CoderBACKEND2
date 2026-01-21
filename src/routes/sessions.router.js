import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";

const router = Router();


router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exists = await UserModel.findOne({ email });
  if (exists) return res.status(400).send({ error: "Usuario ya existe" });

  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password)
  });

  res.send({ status: "success", user });
});


router.post("/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { user },
      "jwtSecretKey",
      { expiresIn: "1h" }
    );

    res.send({ status: "success", token });
  }
);


router.get("/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({ status: "success", user: req.user });
  }
);

export default router;
