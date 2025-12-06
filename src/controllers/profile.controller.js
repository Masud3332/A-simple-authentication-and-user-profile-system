import fs from "fs";
import { User } from "../models/User.model.js";
import { apiResponseErr, apiResponseSuccess } from "../utils/serverError.js";
import { statusCode } from "../utils/statusCodes.js";
import { getCloudinaryPublicId, removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

export const getProfile = (req, res) => {
  try {
    if (!req.user) {
      return apiResponseErr(
        null,
        false,
        statusCode.unauthorize,
        "Unauthorized",
        res
      );
    }

    const user = { ...req.user._doc };
    delete user.password;

    return apiResponseSuccess(
      user,
      true,
      statusCode.success,
      "Profile fetched",
      res
    );
  } catch (err) {
    console.error("getProfile error:", err);
    return apiResponseErr(
      null,
      false,
      statusCode.internalServerError,
      "Internal Server Error",
      res
    );
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user)
      return apiResponseErr(
        null,
        false,
        statusCode.unauthorize,
        "Unauthorized",
        res
      );

    const updates = {};
    ["name", "bio", "location"].forEach((key) => {
      if (req.body[key]) updates[key] = req.body[key];
    });

    if (req.file) {
      console.log("Local file:", req.file.path);

      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse || !cloudinaryResponse.url) {
        return apiResponseErr(
          null,
          false,
          statusCode.badRequest,
          "Failed to upload file to Cloudinary",
          res
        );
      }

      const userData = await User.findById(req.user._id);

      if (userData?.profilePicture) {
        const oldPublicId = getCloudinaryPublicId(userData.profilePicture);
        await removeFromCloudinary(oldPublicId);
      }

      updates.profilePicture = cloudinaryResponse.url;

      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    return apiResponseSuccess(
      updatedUser,
      true,
      statusCode.success,
      "Profile updated successfully",
      res
    );
  } catch (err) {
    console.log("Update profile error:", err);
    return apiResponseErr(
      null,
      false,
      statusCode.internalServerError,
      "Internal server error",
      res
    );
  }
};

