import express from "express";
import * as importController from "../controllers/importController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Allow Tester, QA Lead, and Admins to import results
const importAuth = [protect, authorizeRoles("Tester", "QA Lead", "Admin")];

router.post("/", ...importAuth, importController.importTestResults);

// Specific integrations using file upload
router.post("/playwright", ...importAuth, upload.single("file"), importController.importPlaywright);
router.post("/cypress", ...importAuth, upload.single("file"), importController.importCypress);

export default router;
