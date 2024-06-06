import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import  {logUser, UserDocument}  from "../../schema/User";
import createError from "http-errors";
import * as userService from "./user";
import dotenv from 'dotenv';
dotenv.config();

const isValidPassword = async function (value: string, password: string) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};
const jwt_secret: string = process.env.JWT_SECRET as string;
export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: jwt_secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        try {
          done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // user login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email);
          if (user == null) {
            done(createError(401, "User not found!"), false);
            return;
          }

          if (user.blocked) {
            done(createError(401, "User is blocked, Contact to admin"), false);
            return;
          }

          const validate = await isValidPassword(password, user.password);
          
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, ...result } = user;
          done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );

  passport.use(
    "jwt",
    new Strategy(
      {
        secretOrKey: jwt_secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload, done) => {
        try {

          const user = await userService.getUserByEmail(payload.email); // Fetch user based on payload.userId
          const isAdmin = user?.isAdmin;
          if (!user || !isAdmin) {
            return done(createError(401, "Unauthorized user"), false);
          }

          // If user is found, return the user
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "jwt_no_admin",
    new Strategy(
      {
        secretOrKey: jwt_secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload, done) => {
        try {
          // Fetch user based on payload.userId
          const user = await userService.getUserByEmail(payload.email);
          
          // If user is found and the email matches the decoded email
          if (user && user.email === payload.email) {
            return done(null, user);
          } else {
            // If user is not found or email doesn't match, return an unauthorized error
            return done(createError(401, "Unauthorized user"), false);
          }
        } catch (error) {
          // If an error occurs, return the error
          return done(error, false);
        }
      }
    )
  );
  

};

export const createUserTokens = (user: Omit<logUser, "password">) => {
  const token = jwt.sign(user, jwt_secret);
  return { accessToken: token, refreshToken: "" };
};

export const decodeToken = (token: string) => {
  const decode = jwt.decode(token);
  return decode as logUser;
};
