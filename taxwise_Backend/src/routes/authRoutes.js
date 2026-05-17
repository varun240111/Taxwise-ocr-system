//  Which URL calls which function.

import express from "express";

import {
    registerUser,
    verifyOtp,
    loginUser,
    refreshAccessToken,
} from "../controllers/authControllers.js";

const router=express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
export default router;  