import asyncHandler from "../../../utils/asyncHandler.js";
import { User } from "../../../models/user.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { userName, fullName, email, password } = req.body;
    const user = await User.create({
      email,
      password,
      userName,
      fullName,
      avatar,
    });
    res.status(200).send({ user });
  } catch (e) {
    console.log(e);
  }
});

export default registerUser;
