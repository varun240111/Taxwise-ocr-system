// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { generateTaxReport } from "../controllers/reportController.js";

// const router = express.Router();

// router.post("/tax-report", authMiddleware, generateTaxReport);

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateTaxReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Report routes working",
  });
});

router.post("/tax-report", authMiddleware, generateTaxReport);

export default router;