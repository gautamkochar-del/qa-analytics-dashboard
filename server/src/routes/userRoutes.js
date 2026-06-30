import express from "express";
import * as userController from "../controllers/userController.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

// All user management routes require Admin privileges
router.use(authorizeRoles("Admin"));

router.get("/", userController.getAllUsers);
router.post("/", auditLog("CREATE", "User"), userController.createUser);
router.put("/:id", auditLog("UPDATE", "User"), userController.updateUser);
router.patch("/:id/disable", auditLog("UPDATE", "User"), userController.toggleUserStatus);
router.patch("/:id/reset-password", auditLog("UPDATE", "User"), userController.resetUserPassword);

export default router;
