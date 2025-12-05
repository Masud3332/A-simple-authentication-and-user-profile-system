import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { statusCode } from "../utils/statusCodes.js";
import { apiResponseErr } from "../utils/serverError.js";

export const authorize = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token)
      return apiResponseErr(
        null,
        false,
        statusCode.unauthorize,
        "unauthorized",
        res
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user)
      return apiResponseErr(
        null,
        false,
        statusCode.unauthorize,
        "unauthorized",
        res
      );

    req.user = user;
    next();
  } catch (err) {
    return apiResponseErr(
      null,
      false,
      statusCode.unauthorize,
      "Invalid token",
      res
    );
  }
};
