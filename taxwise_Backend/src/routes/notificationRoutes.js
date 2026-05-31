import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);

export default router;