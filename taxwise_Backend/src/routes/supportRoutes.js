import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  updateTicketStatus,
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/ticket", authMiddleware, createSupportTicket);
router.get("/my-tickets", authMiddleware, getMySupportTickets);
router.get("/admin/tickets", authMiddleware, getAllSupportTickets);

router.put(
  "/admin/tickets/:id/status",
  authMiddleware,
  updateTicketStatus
);

export default router;