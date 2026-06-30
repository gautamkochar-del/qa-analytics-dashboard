import express from "express";
import {
  getExecutionHeatmap,
  getFlakyTests,
  getDurationTrends,
  getBugResolutionStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/execution-heatmap", getExecutionHeatmap);
router.get("/flaky-tests", getFlakyTests);
router.get("/duration-trends", getDurationTrends);
router.get("/bug-resolution", getBugResolutionStats);

export default router;
