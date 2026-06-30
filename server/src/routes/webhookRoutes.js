import express from "express";
import * as webhookController from "../controllers/webhookController.js";

const router = express.Router();

// Webhook endpoints for CI/CD integrations
router.post("/jenkins", webhookController.jenkinsWebhook);
router.post("/github", webhookController.githubWebhook);
router.post("/azure", webhookController.azureDevOpsWebhook);
router.post("/gitlab", webhookController.gitlabWebhook);

export default router;
