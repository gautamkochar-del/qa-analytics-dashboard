import * as githubWorkflowService from "../services/githubWorkflowService.js";

export const getWorkflows = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const data = await githubWorkflowService.getWorkflows(req.user.id, owner, repo);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWorkflowRuns = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { workflowId } = req.params;
    const data = await githubWorkflowService.getWorkflowRuns(req.user.id, owner, repo, workflowId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRun = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { runId } = req.params;
    const data = await githubWorkflowService.getRun(req.user.id, owner, repo, runId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRunJobs = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { runId } = req.params;
    const data = await githubWorkflowService.getRunJobs(req.user.id, owner, repo, runId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobLogs = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { jobId } = req.params;
    const data = await githubWorkflowService.getJobLogs(req.user.id, owner, repo, jobId);
    res.type('text/plain').send(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRunLogs = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { runId } = req.params;
    const data = await githubWorkflowService.getRunLogs(req.user.id, owner, repo, runId);
    
    // Logs are returned as a zip file from GitHub
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename=logs-${runId}.zip`);
    res.send(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rerunWorkflow = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { runId } = req.params;
    const data = await githubWorkflowService.rerunWorkflow(req.user.id, owner, repo, runId);
    res.json({ message: "Workflow rerun initiated.", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelWorkflow = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const { runId } = req.params;
    const data = await githubWorkflowService.cancelWorkflow(req.user.id, owner, repo, runId);
    res.json({ message: "Workflow cancellation initiated.", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
