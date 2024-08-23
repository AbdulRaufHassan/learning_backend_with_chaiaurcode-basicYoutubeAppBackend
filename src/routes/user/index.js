import { Router } from "express";
import registerUser from "../../controllers/user/register.js";
import upload from "../../middlewares/multer.js";
import loginUser from "../../controllers/user/login.js";

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


export default router;
