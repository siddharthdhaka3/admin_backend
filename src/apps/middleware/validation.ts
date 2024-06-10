import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import refreshAccessTokenController from '../controllers/refreshAccessToken'; // Import your refreshAccessToken controller
import createHttpError from "http-errors";
import { jwtDecode } from "jwt-decode";
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

export const checkTokenExpiry = async (req: Request, res: Response, next: Function) => {
  try {
    // Check if the access token is present in the request
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    // Decode the access token to extract expiration time
    const decodedToken = jwtDecode(accessToken) as { exp?: number };
    if (!decodedToken || !decodedToken.exp) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
    const tokenExpiry = decodedToken.exp * 1000; // Expiry time in milliseconds

    // Check if the token is expired
    if (Date.now() >= tokenExpiry) {
      // Token is expired, refresh it
      return refreshAccessTokenController(req, res);
    }
    console.log("all good");
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
