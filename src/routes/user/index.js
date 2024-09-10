import { Router } from "express";
import registerUser from "../../controllers/user/register.js";
import upload from "../../middlewares/multer.js";
import loginUser from "../../controllers/user/login.js";
import logoutUser from "../../controllers/user/logout.js";
import verifyJwt from "../../middlewares/verifyJwt.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login",loginUser)
router.post("/logout",verifyJwt,logoutUser)

export default router;