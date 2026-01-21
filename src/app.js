import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";

import sessionsRouter from "./routes/sessions.router.js";
import { initializePassport } from "./config/passport.config.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB conectada"))
    .catch(err => console.log("Error DB:", err));

initializePassport();
app.use(passport.initialize());

app.use("/api/sessions", sessionsRouter);

app.listen(8080, () => {
    console.log("Servidor OK");
});