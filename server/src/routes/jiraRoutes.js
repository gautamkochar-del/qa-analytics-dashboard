import express from "express";
import { syncBugs, createIssue, getIssueDetails } from "../controllers/jiraController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/sync", syncBugs);
router.post("/issue/:bugId", createIssue);
router.get("/issue/:bugId", getIssueDetails);

export default router;
