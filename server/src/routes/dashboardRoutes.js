import express from "express";

import {
  getDashboard,
  getPassFailChart,
  getExecutionTrend,
  getBugSeverity,
  getRecentTestRuns,
  getRecentBugs,
  getProjectHealth,
  getRecentActivity,
  getNotifications,
  getTeamActivity,
  getInsights,
} from "../controllers/dashboardController.js";

const router = express.Router();

// Summary
router.get("/", getDashboard);
router.get("/summary", getDashboard);

// Charts
router.get("/charts/pass-fail", getPassFailChart);
router.get("/charts/execution-trend", getExecutionTrend);
router.get("/charts/bug-severity", getBugSeverity);

// Dashboard widgets
router.get("/recent-test-runs", getRecentTestRuns);
router.get("/recent-bugs", getRecentBugs);
router.get("/project-health", getProjectHealth);
router.get("/activity", getRecentActivity);
router.get("/notifications", getNotifications);
router.get("/team", getTeamActivity);
router.get("/insights", getInsights);

export default router;
