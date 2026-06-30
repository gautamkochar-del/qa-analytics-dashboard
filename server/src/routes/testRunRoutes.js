import express from "express";
import {
  getTestRuns,
  getTestRun,
  createTestRun,
  updateTestRun,
  deleteTestRun,
} from "../controllers/testRunController.js";

import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", getTestRuns);

router.get("/:id", getTestRun);

router.post("/", auditLog("TestRun"), createTestRun);

router.put("/:id", authorizeRoles("Admin", "QA Lead", "Tester"), auditLog("TestRun"), updateTestRun);

router.delete("/:id", authorizeRoles("Admin", "QA Lead"), auditLog("TestRun"), deleteTestRun);

export default router;
