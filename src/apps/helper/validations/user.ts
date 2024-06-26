import { check } from "express-validator";
import User from "../../schema/User";

export const userLogin = [
  check("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  check("password")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Password is required"),
];


export const password = check("password")
  .exists()
  .bail()
  .withMessage("Password is required")
  .notEmpty()
  .bail()
  .withMessage("Password is required")
  .isStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .bail()
  .withMessage("Enter strong password");

export const createUser = [
  check("email")
    .exists()
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
  password
];

export const updateUser = [
  check("email")
    .optional()
    .isEmail()
    .withMessage("Enter valid email"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  check("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Enter valid phone number"),
  check("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean value"),
  check("blocked")
    .optional()
    .isBoolean()
    .withMessage("Blocked must be a boolean value"),
];


export const createUserWithLink = [
  check("email")
    .exists()
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
];
