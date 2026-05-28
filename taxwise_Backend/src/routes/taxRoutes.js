import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  calculateTax,
  getLatestTaxCalculation,
} from "../controllers/taxController.js";

const router = express.Router();

router.post("/calculate", authMiddleware, calculateTax);
router.get("/latest", authMiddleware, getLatestTaxCalculation);

export default router;