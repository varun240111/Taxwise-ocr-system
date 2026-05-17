import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { calculateTax } from "../controllers/taxController.js";

const router = express.Router();

router.post("/calculate", authMiddleware, calculateTax);

export default router;