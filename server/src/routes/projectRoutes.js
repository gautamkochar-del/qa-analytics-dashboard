import express from "express";
import * as controller from "../controllers/projectController.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", controller.getProjects);
router.get("/:id", controller.getProject);
router.post("/", authorizeRoles("Admin", "QA Lead"), auditLog("Project"), controller.createProject);
router.put("/:id", authorizeRoles("Admin", "QA Lead"), auditLog("Project"), controller.updateProject);
router.delete("/:id", authorizeRoles("Admin"), auditLog("Project"), controller.deleteProject);

export default router;
