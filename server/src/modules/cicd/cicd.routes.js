import express from "express";
import * as cicdController from "./cicd.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Jenkins Connection Management
router.post("/jenkins/connect", cicdController.connect);
router.post("/jenkins/disconnect", cicdController.disconnect);
router.get("/jenkins/status", cicdController.getStatus);

// Jenkins Jobs & Builds
router.get("/jenkins/jobs", cicdController.getJobs);
router.get("/jenkins/jobs/:jobName/builds", cicdController.getBuilds);
router.get("/jenkins/jobs/:jobName/builds/:buildNumber/log", cicdController.getBuildLog);
router.get("/jenkins/jobs/:jobName/builds/:buildNumber/failed-stage", cicdController.getFailedStage);
router.post("/jenkins/jobs/:jobName/build", cicdController.triggerJob);

// Linking
router.post("/link-build", cicdController.linkBuild);

export default router;
