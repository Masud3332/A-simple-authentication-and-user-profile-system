import { upload } from "../config/multer.js";
import {
  registerUser,
  loginEmail,
  loginPhone,
} from "../controllers/auth.controller.js";
import customErrorHandler from "../utils/customErrorHandler.js";
import {
  loginEmailValidator,
  loginPhoneValidator,
  registerUserValidator,
} from "../validation/express.validator.js";

export const authRoutes = (app) => {

  app.post(
    "/api/auth/user/register",
    upload.single("profilePicture"),
    registerUserValidator,
    customErrorHandler,
    registerUser
  );

  app.post(
    "/api/auth/user/login",
    loginEmailValidator,
    customErrorHandler,
    loginEmail
  );
  
  app.post(
    "/api/auth/user/login-phone",
    loginPhoneValidator,
    customErrorHandler,
    loginPhone
  );
};
