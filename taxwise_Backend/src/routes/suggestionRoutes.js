import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLatestSuggestion } from "../controllers/suggestionController.js";

const router = express.Router();

router.get("/latest", authMiddleware, getLatestSuggestion);

export default router;