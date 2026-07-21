import express from "express";
import * as githubController from "./github.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validateMiddleware.js";
import { connectSchema } from "./github.validation.js";

const router = express.Router();

// Public webhook endpoint
router.post("/webhook", githubController.webhookHandler);

router.use(protect);

router.get("/profile", githubController.getProfile);
router.get("/status", githubController.getStatus);
router.get("/repository", githubController.getRepositories);
router.get("/commits", githubController.getCommits);
router.get("/pull-requests", githubController.getPullRequests);
router.get("/pulls", githubController.getPullRequests);
router.get("/issues", githubController.getIssues);
router.get("/actions", githubController.getActions);
router.post("/actions/run", githubController.runAction);
router.get("/languages", githubController.getLanguages);
router.post("/connect", validate(connectSchema), githubController.connect);
router.post("/disconnect", githubController.disconnect);

export default router;
