import User from "../../schema/User";
import { hashPassword } from "./../services/user";
import createHttpError from "http-errors";
import express from "express";
import passport from "passport";
import { UserDocument } from "../../schema/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { catchError, validate } from "../middleware/validation";
import { createUserTokens, decodeToken } from "../services/passport-jwt";
import * as userService from "../services/user";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  validate("users:login"),
  catchError,
  expressAsyncHandler(async (req, res, next) => {
    res.send(
      createResponse({ ...createUserTokens(req.user!), user: req.user })
    );
  })
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate("users:update"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const user = req.params.id;
    const result = await userService.updateUser(user, req.body);
    res.send(createResponse(user, "User updated successfully!"));
  })
);


router.post(
  "/register-with-link",
  validate("users:create-with-link"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { email, role } = req.body as IUser;
    const user = await userService.createUserWithResetPasswordLink({
      email,
      role,
    });
    res.send(createResponse(user, "Reset password link sent successfully!"));
  })
);



export default router;
