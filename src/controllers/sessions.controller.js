import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { transporter } from "../utils/mailing.js";
import UserService from "../services/user.service.js";
import UserRepository from "../repositories/user.repository.js";
import UserDAO from "../dao/user.dao.js";
import UserDTO from "../dto/user.dto.js";

const userService = new UserService(new UserRepository(new UserDAO()));

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await userService.registerUser({
      first_name, last_name, email, age, password: createHash(password)
    });
    res.status(201).send({ status: "success", user: new UserDTO(user) });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("coderCookie", token, { httpOnly: true, signed: true })
       .send({ status: "success", user: new UserDTO(user) });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const current = async (req, res) => {
  res.send({ status: "success", user: new UserDTO(req.user) });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", message: "Usuario no encontrado" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const link = `http://localhost:8080/api/sessions/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<a href="${link}">Restablecer contraseña</a>`
    });

    res.send({ status: "success", message: "Mail enviado" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.getUserByEmail(decoded.email);

    if (isValidPassword(user, newPassword))
      return res.status(400).send({ status: "error", message: "No puede usar la misma contraseña" });

    await userService.updateUser(user._id, { password: createHash(newPassword) });
    res.send({ status: "success", message: "Contraseña actualizada" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "Token inválido o expirado" });
  }
};