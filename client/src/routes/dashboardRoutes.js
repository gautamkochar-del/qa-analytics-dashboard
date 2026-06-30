import express from "express";

import {
  getDashboard,
  getRecentTestRuns,
  getRecentBugs,
  getProjectHealth,
  getRecentActivity,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboard);
router.get("/recent-test-runs", getRecentTestRuns);
router.get("/recent-bugs", getRecentBugs);
router.get("/project-health", getProjectHealth);
router.get("/activity", getRecentActivity);

export default router;
