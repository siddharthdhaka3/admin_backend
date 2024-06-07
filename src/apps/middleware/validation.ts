import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import {
  userLogin,
  createUser,
  createUserWithLink,
  password,
  updateUser,
} from "../helper/validations/user";

export const validate = (validationName: string): any[] => {
  switch (validationName) {
    case "users:login": {
      return userLogin;
    }
    case "users:create": {
      return createUser;
    }
    case "user:update": {
      return updateUser;
    }
    case "users:create-with-link": {
      return createUserWithLink;
    }
    case "set-new-password":
      return [password];
    default:
      return [];
  }
};

export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {    
    const errors = validationResult(req);
    
    const isError = errors.isEmpty();
    if (!isError) {
      const data = { errors: errors.array() };      
      throw createHttpError(400, {
        message: "Validation error!hai",
        data,
      });
    } else {      
      next();
    }
  }
);
