import { User } from "../../models/user.js";
import ApiError from "../../utils/apiError.js";

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user?._id, {
      $set: { refreshToken: null },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "user logged out"));
  } catch (e) {
    res.status(500).json(new ApiError(500, e?.message));
  }
};

export default logoutUser;
