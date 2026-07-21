import express from "express";
import * as ctrl from "../controllers/sprint3Controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Departments
router.get("/departments", ctrl.getDepartments);

// TestCases
router.get("/testcases", ctrl.getTestCases);
router.post("/testcases", ctrl.createTestCase);

// Releases
router.get("/releases", ctrl.getReleases);
router.post("/releases", ctrl.createRelease);

// Sprints
router.get("/sprints", ctrl.getSprints);
router.post("/sprints", ctrl.createSprint);

// AI
router.post("/ai", ctrl.askAI);

// Security
router.get("/security", ctrl.getSecurityLogs);

// Activity
router.get("/activity", ctrl.getActivity);

// Dashboard Layout
router.post("/dashboard/layout", ctrl.saveLayout);
router.get("/dashboard/layout/:userId", ctrl.getLayout);

export default router;
