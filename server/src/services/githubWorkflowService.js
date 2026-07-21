import axios from "axios";
import prisma from "../config/prisma.js";

const GITHUB_API_URL = "https://api.github.com";

const getGitHubToken = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: {
      userId,
      provider: "GitHub",
      isActive: true,
    },
  });

  if (!integration) {
    throw new Error("GitHub is not connected.");
  }

  return integration.apiKey;
};

const getAxiosConfig = async (userId) => {
  const token = await getGitHubToken(userId);
  return {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  };
};

export const getWorkflows = async (userId, owner, repo) => {
  if (!owner || !repo) throw new Error("Owner and repo are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/workflows`, config);
  return response.data;
};

export const getWorkflowRuns = async (userId, owner, repo, workflowId) => {
  if (!owner || !repo || !workflowId) throw new Error("Owner, repo, and workflowId are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`, config);
  return response.data;
};

export const getRun = async (userId, owner, repo, runId) => {
  if (!owner || !repo || !runId) throw new Error("Owner, repo, and runId are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs/${runId}`, config);
  return response.data;
};

export const getRunJobs = async (userId, owner, repo, runId) => {
  if (!owner || !repo || !runId) throw new Error("Owner, repo, and runId are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs/${runId}/jobs`, config);
  return response.data;
};

export const getRunLogs = async (userId, owner, repo, runId) => {
  if (!owner || !repo || !runId) throw new Error("Owner, repo, and runId are required.");
  const config = await getAxiosConfig(userId);
  
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs/${runId}/logs`, {
      ...config,
      // GitHub redirects to the log URL, axios follows by default, returning the zip content or text
      responseType: 'arraybuffer' // Logs are returned as zip files
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const rerunWorkflow = async (userId, owner, repo, runId) => {
  if (!owner || !repo || !runId) throw new Error("Owner, repo, and runId are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.post(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs/${runId}/rerun`, {}, config);
  return response.data;
};

export const cancelWorkflow = async (userId, owner, repo, runId) => {
  if (!owner || !repo || !runId) throw new Error("Owner, repo, and runId are required.");
  const config = await getAxiosConfig(userId);
  const response = await axios.post(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs/${runId}/cancel`, {}, config);
  return response.data;
};

export const getJobLogs = async (userId, owner, repo, jobId) => {
  if (!owner || !repo || !jobId) throw new Error("Owner, repo, and jobId are required.");
  const config = await getAxiosConfig(userId);
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`, {
      ...config,
      responseType: 'text',
      maxRedirects: 5
    });
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return "Logs not found or have expired.";
    }
    throw err;
  }
};
