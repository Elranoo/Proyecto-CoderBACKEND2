import { UserModel } from "../models/user.model.js";
import { CartModel } from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ status: "error", message: "Usuario ya existe" });
    }

    const cart = await CartModel.create({ products: [] });

    await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart._id
    });

    res.status(201).json({ status: "success" });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error en registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", message: "Usuario no existe" });
    }

    if (!isValidPassword(user, password)) {
      return res.status(400).json({ status: "error", message: "Contraseña incorrecta" });
    }

const token = jwt.sign(
  { id: user._id },
  "supersecret123",
  { expiresIn: "1h" }
);

res.cookie("coderCookie", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false
});


    res.json({ status: "success" });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error en login" });
  }
};