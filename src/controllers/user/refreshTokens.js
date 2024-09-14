import { env } from "../../constants.js";
import { User } from "../../models/user.js";
import ApiError from "../../utils/apiError.js";
import { generateAccessAndRefereshTokens } from "../../utils/generateAccess&RefreshToken.js";

const refreshTokens = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshoken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      env.JWT_REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refresh successfully"
        )
      );
  } catch (e) {
    res
      .status(e?.statusCode || 500)
      .json(new ApiError(e?.statusCode || 500, e?.message));
  }
};

export default refreshTokens;
