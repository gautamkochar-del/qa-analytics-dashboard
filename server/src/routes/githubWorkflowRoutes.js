import express from "express";
import * as githubWorkflowController from "../controllers/githubWorkflowController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/workflows", githubWorkflowController.getWorkflows);
router.get("/workflows/:workflowId/runs", githubWorkflowController.getWorkflowRuns);
router.get("/runs/:runId", githubWorkflowController.getRun);
router.get("/runs/:runId/jobs", githubWorkflowController.getRunJobs);
router.get("/jobs/:jobId/logs", githubWorkflowController.getJobLogs);
router.get("/runs/:runId/logs", githubWorkflowController.getRunLogs);
router.post("/runs/:runId/rerun", githubWorkflowController.rerunWorkflow);
router.post("/runs/:runId/cancel", githubWorkflowController.cancelWorkflow);

export default router;
