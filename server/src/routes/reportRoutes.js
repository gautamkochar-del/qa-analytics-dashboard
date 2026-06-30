import express from "express";

import {
  getSummary,
  getPassFailChart,
  getBugSeverityChart,
  getProjectSummary,
  getExecutionTrend,
  getBugTrend,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", getSummary);

router.get("/pass-fail", getPassFailChart);

router.get("/bug-severity", getBugSeverityChart);
router.get("/project-summary", getProjectSummary);
router.get("/execution-trend", getExecutionTrend);

router.get("/bug-trend", getBugTrend);

export default router;
