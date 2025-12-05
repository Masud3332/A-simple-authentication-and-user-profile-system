import { User } from "../models/User.model.js";
import { auth } from "../config/firebase.js";
import { apiResponseErr, apiResponseSuccess } from "../utils/serverError.js";
import { statusCode } from "../utils/statusCodes.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, bio, location } = req.body;

    if (!req.file) {
      return apiResponseErr(null, false, 400, "No file uploaded", res);
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult || !uploadResult.url) {
      return apiResponseErr(null, false, 400, "Failed to upload file to Cloudinary", res);
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      bio,
      location,
      profilePicture: uploadResult.url,
    });

    const token = user.generateAccessToken();

    return apiResponseSuccess({ user, token }, true, 201, "Registered", res);
  } catch (err) {
    console.log("Register error:", err);
    return apiResponseErr(null, false, 500, "Internal server error", res);
  }
};


export const loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "User not found",
        res
      );

    const valid = await user.comparePassword(password);
    if (!valid)
      return apiResponseErr(
        null,
        false,
        statusCode.badRequest,
        "Invalid password",
        res
      );

    const token = user.generateAccessToken();

    return apiResponseSuccess(
      { user, token },
      true,
      statusCode.success,
      "Login success",
      res
    );
  } catch (err) {
    console.log(err);
    return apiResponseErr(
      null,
      false,
      statusCode.internalServerError,
      "Internal server error",
      res
    );
  }
};

export const loginPhone = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await auth.verifyIdToken(idToken);
    const phone = decoded.phone_number;

    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    const token = user.generateAccessToken();

    return apiResponseSuccess(
      { user, token },
      true,
      statusCode.success,
      "Phone login success",
      res
    );
  } catch (err) {
    console.log(err);
    return apiResponseErr(
      null,
      false,
      statusCode.internalServerError,
      "Internal server error",
      res
    );
  }
};
