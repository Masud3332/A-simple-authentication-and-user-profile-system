import { upload } from "../config/multer.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { authorize } from "../middleware/auth.js";

export const profileRoutes = (app) => {

  app.get("/api/get/profile", authorize, getProfile);


  app.put(
    "/api/update/profile",
    authorize,
    upload.single("profilePicture"),
    updateProfile
  );
  
};
