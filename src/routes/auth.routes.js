import { upload } from "../config/multer.js";
import {
  registerUser,
  loginEmail,
  loginPhone,
} from "../controllers/auth.controller.js";
import customErrorHandler from "../utils/customErrorHandler.js";
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
