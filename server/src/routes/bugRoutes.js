import express from "express";

import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
} from "../controllers/bugController.js";

import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", getBugs);
router.post("/", auditLog("Bug"), createBug);
router.put("/:id", auditLog("Bug"), updateBug);
router.delete("/:id", authorizeRoles("Admin", "QA Lead"), auditLog("Bug"), deleteBug);

export default router;
