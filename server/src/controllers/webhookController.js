import prisma from "../config/prisma.js";

// Helper to create test run
const createRunFromWebhook = async (req, res, payload, providerName) => {
  try {
    const apiKey = req.query.apiKey;
    
    // Verify API key from integration
    const integration = await prisma.integration.findFirst({
      where: { apiKey, provider: providerName, isActive: true },
    });
    
    if (!integration) {
      return res.status(401).json({ message: "Invalid or missing API Key" });
    }

    // Default project id or get from metadata
    let projectId = 1; // Fallback
    if (integration.metadata) {
      try {
        const meta = JSON.parse(integration.metadata);
        if (meta.projectId) projectId = meta.projectId;
      } catch (e) {}
    }

    const {
      suiteName = `${providerName} Automated Run`,
      passed = 0,
      failed = 0,
      skipped = 0,
      duration = 0,
      buildUrl = "",
      runId = "",
    } = payload;

    const total = passed + failed + skipped;
    const status = failed > 0 ? "failed" : "passed";

    const testRun = await prisma.testRun.create({
      data: {
        projectId: Number(projectId),
        environment: "CI/CD",
        suiteName,
        status,
        total,
        passed,
        failed,
        skipped,
        duration,
        jenkinsBuildUrl: buildUrl,
        githubRunId: runId,
      },
    });

    req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "create" });

    return res.status(201).json({ message: "Results imported successfully", testRun });
  } catch (error) {
    console.error(`Webhook error (${providerName}):`, error);
    return res.status(500).json({ message: "Webhook processing failed", error: error.message });
  }
};

export const jenkinsWebhook = async (req, res) => {
  const payload = {
    suiteName: req.body.jobName || req.body.suiteName || "Jenkins Job",
    passed: Number(req.body.passed || req.body.passCount || 0),
    failed: Number(req.body.failed || req.body.failCount || 0),
    skipped: Number(req.body.skipped || req.body.skipCount || 0),
    duration: Number(req.body.duration || 0),
    buildUrl: req.body.buildUrl || "",
  };
  return createRunFromWebhook(req, res, payload, "Jenkins");
};

export const githubWebhook = async (req, res) => {
  const payload = {
    suiteName: req.body.workflow_name || req.body.suiteName || req.body.name || "GitHub Action",
    passed: Number(req.body.passed || 0),
    failed: Number(req.body.failed || 0),
    skipped: Number(req.body.skipped || 0),
    duration: Number(req.body.duration || 0),
    runId: String(req.body.run_id || req.body.runId || ""),
  };
  return createRunFromWebhook(req, res, payload, "GitHub");
};

export const azureDevOpsWebhook = async (req, res) => {
  const payload = {
    suiteName: req.body.resource?.definition?.name || req.body.suiteName || req.body.buildName || "Azure DevOps Pipeline",
    passed: Number(req.body.passed || 0),
    failed: Number(req.body.failed || 0),
    skipped: Number(req.body.skipped || 0),
    duration: Number(req.body.duration || 0),
    buildUrl: req.body.resource?.url || req.body.buildUrl || "",
  };
  return createRunFromWebhook(req, res, payload, "Azure DevOps");
};

export const gitlabWebhook = async (req, res) => {
  const payload = {
    suiteName: req.body.project?.name || req.body.suiteName || req.body.pipelineName || "GitLab Pipeline",
    passed: Number(req.body.passed || 0),
    failed: Number(req.body.failed || 0),
    skipped: Number(req.body.skipped || 0),
    duration: Number(req.body.object_attributes?.duration || req.body.duration || 0),
    buildUrl: req.body.project?.web_url || req.body.buildUrl || "",
  };
  return createRunFromWebhook(req, res, payload, "GitLab CI");
};
