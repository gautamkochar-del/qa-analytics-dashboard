import * as testRunService from "../services/testRunService.js";
import * as emailService from "../services/emailService.js";

export const getTestRuns = async (req, res) => {
  try {
    const { projectId, status, environment, search, page, limit, sortBy, sortOrder } = req.query;
    const runs = await testRunService.getAllTestRuns({
      projectId,
      status,
      environment,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });
    res.json(runs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load test runs" });
  }
};

export const getTestRun = async (req, res) => {
  try {
    const run = await testRunService.getTestRunById(req.params.id);

    if (!run) {
      return res.status(404).json({
        message: "Test run not found",
      });
    }

    res.json(run);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load test run" });
  }
};

export const createTestRun = async (req, res) => {
  try {
    const testRun = await testRunService.createTestRun(req.body);

    req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "create" });

    // Trigger Notification if execution is completed
    if (["passed", "failed"].includes(testRun.status)) {
      emailService.sendExecutionCompletedEmail(testRun).catch(console.error);
    }

    res.status(201).json(testRun);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create test run",
      error: error.message,
    });
  }
};

export const updateTestRun = async (req, res) => {
  try {
    const run = await testRunService.updateTestRun(
      req.params.id,
      req.body
    );
    
    req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "update" });

    // Trigger Notification if execution is completed
    if (["passed", "failed"].includes(run.status)) {
      emailService.sendExecutionCompletedEmail(run).catch(console.error);
    }

    res.json(run);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update test run" });
  }
};

export const deleteTestRun = async (req, res) => {
  try {
    await testRunService.deleteTestRun(req.params.id);

    req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "delete" });

    res.json({
      message: "Test run deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete test run" });
  }
};
