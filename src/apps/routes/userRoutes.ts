import { hashPassword } from "./../services/user";
import createHttpError from "http-errors";
import express from "express";
import passport from "passport";
import User, { logUser, UserDocument } from "../../schema/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { catchError, validate } from "../middleware/validation";
import { createUserTokens, decodeToken } from "../services/passport-jwt";
import * as userService from "../services/user";
import { Router, Request, Response } from 'express';

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

router.get(
  "/all",
  passport.authenticate("jwt", {session: false}),
  catchError,
  expressAsyncHandler(async(req, res)=> {
    const users = await User.find();
    res.json(users);
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

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const user = req.params.id;
    const result = await userService.deleteUser(user);
    res.send(createResponse(user, "User deleted successfully!"));
  })
);

router.post(
  "/register",
  validate("users:create"),
  catchError,
  expressAsyncHandler(async (req, res) => {    
    const { email, password, isAdmin, phoneNumber, name, blocked, createdAt} = req.body as UserDocument;
    const user = await userService.createUser({ email, password, isAdmin, phoneNumber, name, blocked, createdAt });
    res.send(createResponse(user, "User created successfully!"));
  })
);

router.post(
  "/register-with-link",
  validate("users:create-with-link"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { email} = req.body as UserDocument;
    const user = await userService.createUserWithResetPasswordLink({
      email,
    });
    res.send(createResponse(user, "Reset password link sent successfully!"));
  })
);

export default router;
