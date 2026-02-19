import passport from "passport";
import jwt from "passport-jwt";
import { UserModel } from "../models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {

  passport.use("jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => req?.cookies?.coderCookie
        ]),
        secretOrKey: "supersecret123"
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};