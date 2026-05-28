import express from "express";

import {
  setupProfile,
  checkProfile,
  getProfile,
  updateProfile,
  updateTaxDetails,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup", authMiddleware, setupProfile);

router.get("/check", authMiddleware, checkProfile);

router.get("/", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.patch(
  "/tax-details",
  authMiddleware,
  updateTaxDetails
);

export default router;