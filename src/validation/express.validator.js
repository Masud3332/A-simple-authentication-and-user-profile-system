import { body, param, query } from "express-validator";
import { User } from "../models/User.model.js";
export const registerUserValidator = [

  body("name")
    .optional()
    .isString().withMessage("Name must be a string"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("Email already registered");
      }
    }),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number")
    .custom(async (value) => {
      if (!value) return true;
      const user = await User.findOne({ phone: value });
      if (user) {
        return Promise.reject("Phone already registered");
      }
    }),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


export const loginEmailValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const loginPhoneValidator = [
  body("idToken").notEmpty().withMessage("idToken is required"),
];
