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
      new ApiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!findUser) {
      throw new ApiError("Invalid access token");
    }
    req.user = findUser;
    next();
  } catch (e) {
    res.status(401).send(new ApiError(401, e?.message));
  }
};

export default verifyJwt;
