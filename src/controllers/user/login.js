import loginSchema from "../../joi/user/login.js";
import { User } from "../../models/user.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";

const loginUser = async (req, res) => {
  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      throw new ApiError(400, error);
    }
    const { email, userName, password } = req.body;
    const userData = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (!userData) {
      throw new ApiError(409, "user does not exist");
    }
    const isCorrectPassword = userData.isPasswordCorrect(password);
    if (!isCorrectPassword) {
      throw new ApiError(401, "Invalid user credentials");
    }
    const accessToken = await userData.generateAccessToken();
    const refreshToken = await userData.generateRefreshToken();
    userData.refreshToken = refreshToken;
    await userData.save({ validateBeforeSave: false });
    const options = {
      httpOnly: true,
      secure: true,
    };
    const userDoc = userData._doc;
    userDoc.accessToken = accessToken;
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, userDoc, "user loggedIn successfully"));
  } catch (e) {
    res.status(400).send(new ApiError(400, e.message));
  }
};

export default loginUser;
