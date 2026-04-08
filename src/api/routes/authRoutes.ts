import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  confirmForgetPassword,
  deleteUser,
  forgotPassword,
  loginUser,
  lookupUserByEmail,
  refreshToken,
  registerUser,
  resendOtp,
  resetPassword,
  uploadAvatar,
  verifyOtp,
} from "../controllers/authController";

const router = Router();

router.post("/signUp", registerUser);
router.post("/confirm", verifyOtp);
router.post("/resendConfirmationCode", resendOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/setNewPassword", resetPassword);
router.post("/confirmForgetPassword", confirmForgetPassword);
router.post("/signIn", loginUser);

router.post("/refreshToken", refreshToken);

// GET /lookup/:email
router.get("/lookup/:email", lookupUserByEmail);

// router.get("/profile", getProfile);
// router.put("/profile", updateProfile);
router.delete("/profile", deleteUser);



export default router;
