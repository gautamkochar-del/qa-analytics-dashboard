import express from "express";
import multer from "multer";
import * as testResultController from "./testResult.controller.js";
import * as importController from "../../controllers/importController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/rbacMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Role based auth for importing
const importAuth = [protect, authorizeRoles("Tester", "QA Lead", "Admin")];

router.use(protect);

router.get("/run/:testRunId", testResultController.getTestCases);
router.get("/:id", testResultController.getTestCase);
router.put("/:id", testResultController.updateTestCase);

router.post("/import", ...importAuth, upload.single("file"), importController.importJUnit);

export default router;
