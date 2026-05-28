import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get("/", authMiddleware, getUserDocuments);

router.delete("/:id", authMiddleware, deleteDocument);

export default router;