import loginSchema from "../../joi/user/login.js";
import { User } from "../../models/user.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { generateAccessAndRefereshTokens } from "../../utils/generateAccess&RefreshToken.js";

const loginUser = async (req, res) => {
  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      throw new ApiError(400, error);
    }
    const { email, password } = req.body;
    const userData = await User.findOne({
      email,
    });
    if (!userData) {
      throw new ApiError(409, "user does not exist");
    }
    const isCorrectPassword = userData.isPasswordCorrect(password);
    if (!isCorrectPassword) {
      throw new ApiError(401, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      userData._id
    );

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
    res
      .status(e?.statusCode || 500)
      .send(new ApiError(e?.statusCode || 500, e?.message));
  }
};

export default loginUser;
