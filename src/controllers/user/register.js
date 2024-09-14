import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import registerSchema from "../../joi/user/register.js";
import { User } from "../../models/user.js";

const registerUser = async (req, res) => {
  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      throw new ApiError(400, error);
    }
    const { userName, fullName, email, password } = req.body;
    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User already exist");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImgLocalPath =
      req.files?.coverImage && req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Internal Server Error");
    }

    const user = await User.create({
      email,
      password,
      userName: userName.toLowerCase(),
      fullName,
      avatar: avatar.url,
      coverImage: coverImg?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Internal Server Error");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "user register successfully"));
  } catch (e) {
    res
      .status(e?.statusCode || 500)
      .send(new ApiError(e?.statusCode || 500, e?.message));
  }
};

export default registerUser;
