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
    res.json({...createUserTokens(req.user!), user: req.user})
  //   res.send(
  //     createResponse({ ...createUserTokens(req.user!), user: req.user })
  // };
  })
);

router.get(
  "/all",
  passport.authenticate("jwt", {session: false}),
  catchError,
  expressAsyncHandler(async(req, res)=> {
    const users = await User.find();
    res.json(users);
    //res.send(createResponse(users, "All users retrieved"));
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

router.put(
  "/email/:email",
  passport.authenticate("jwt_no_admin_user_update", { session: false }),
  validate("users:update"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    
    if (req.user && typeof req.user === 'object') {
      // Check if req.user has the email property
      if ('email' in req.user) {
        const email = req.user.email;
        if(email !== req.params.email){
          res.status(401).json({ message: 'User not authenticated' });
        }
      }
    }
    const em = req.params.email;
    const result = await userService.updateUserByEmail(em, req.body);
    res.send(createResponse(em, "User updated successfully!"));
  })
);

router.put(
  "/link/reset-password",
  passport.authenticate("jwt_no_admin_user_update", { session: false }),
  validate("set-new-password"),
  catchError,
  expressAsyncHandler(async (req, res) => {
        
    if (req.user && typeof req.user === 'object') {
      // Check if req.user has the email property
      if ('email' in req.user) {
        const email:any = req.user.email;
        console.log(email);
        console.log("here is your email");
        
        
        const result = await userService.updateUserByEmail(email, req.body);
        res.send(createResponse(result, "password updated successfully!"));

      }
    }
    
    //res.json("done")
  })
);


router.post(
  "/reset-password",
  passport.authenticate("jwt_no_admin", { session: false }),
  validate("users:set-new-password"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const password = await hashPassword(req.body['Password']);
    if (req.user && typeof req.user === 'object') {
      if ('email' in req.user) {
        const email:any = req.user.email;
        const user = await User.findOneAndUpdate(
          { email: email },
          { $set: { password: password } },
          { new: true }
        );
        if(user){
          res.send(createResponse(user, "Password updated successfully!"));

        }
      }
    }    
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
    res.send(createResponse(user, "Registration link sent successfully!"));
  })
);

router.post(
  "/forgot-password",
  catchError,
  expressAsyncHandler(async (req, res) => {
    
    const { email} = req.body as UserDocument;
    const user1  = await userService.getUserByEmail(email);
    if(!user1){
      res.status(401).json({ message: 'User not authenticated' });
        }else{
      const user = await userService.forgotPassword({
        email,
      });
      res.send(createResponse(user, "Reset password link sent successfully!"));
    }
  })
  
);

export default router;
