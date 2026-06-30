import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.use(authorizeRoles("Admin"));

router.get("/roles", adminController.getRoles);
router.post("/roles", auditLog("CREATE", "Role"), adminController.createRole);

router.get("/departments", adminController.getDepartments);
router.post("/departments", auditLog("CREATE", "Department"), adminController.createDepartment);

router.get("/teams", adminController.getTeams);
router.post("/teams", auditLog("CREATE", "Team"), adminController.createTeam);

export default router;
