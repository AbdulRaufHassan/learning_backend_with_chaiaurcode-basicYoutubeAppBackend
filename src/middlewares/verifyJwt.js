import { env } from "../constants.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!findUser) {
      throw new ApiError(401,"Invalid access token");
    }
    req.user = findUser;
    next();
  } catch (e) {
    res
      .status(e?.statusCode || 500)
      .send(new ApiError(e?.statusCode || 500, e?.message));
  }
};

export default verifyJwt;
