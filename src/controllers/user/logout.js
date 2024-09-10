import { User } from "../../models/user.js";
import ApiResponse from "../../utils/apiResponse.js";

const logoutUser = async (req, res) => {
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
};

export default logoutUser;
