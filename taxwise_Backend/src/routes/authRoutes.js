// Which URL calls which function.

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerUser,
  verifyOtp,
  loginUser,
  refreshAccessToken,
  updateAccountProfile,
  changePassword,
  updateNotifications,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateAccountProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.post("/logout-all", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Logged out from all devices",
  });
});

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.put(
  "/notifications",
  authMiddleware,
  updateNotifications
);

export default router;