import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import sessionsRouter from "./routes/sessions.router.js";
import { initializePassport } from "./config/passport.config.js";

const app = express();

app.use(express.json());

mongoose.connect("TU_STRING_DE_MONGO");

initializePassport();
app.use(passport.initialize());

app.use("/api/sessions", sessionsRouter);

app.listen(8080, () => console.log("Servidor OK"));
