import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createSupportTicket,
  getMySupportTickets,
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/ticket", authMiddleware, createSupportTicket);
router.get("/my-tickets", authMiddleware, getMySupportTickets);

export default router;