import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  uploadSalarySlip,
  confirmSalaryData,
  getLatestSalaryRecord,
  getAllSalaryRecords,
  getActiveSalaryRecord,
  markSalaryRecordActive,
} from "../controllers/salaryController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("salarySlip"), uploadSalarySlip);

router.post("/confirm", authMiddleware, confirmSalaryData);

router.get("/latest", authMiddleware, getLatestSalaryRecord);

router.get("/all", authMiddleware, getAllSalaryRecords);

router.get("/active", authMiddleware, getActiveSalaryRecord);

router.patch("/:id/mark-active", authMiddleware, markSalaryRecordActive);

export default router;