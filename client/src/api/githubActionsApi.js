import api from "./axios";

export const getWorkflows = async (owner, repo) => {
  const { data } = await api.get(`/github/workflows`, { params: { owner, repo } });
  return data;
};

export const getWorkflowRuns = async (owner, repo, workflowId) => {
  const { data } = await api.get(`/github/workflows/${workflowId}/runs`, { params: { owner, repo } });
  return data;
};

export const getRun = async (owner, repo, runId) => {
  const { data } = await api.get(`/github/runs/${runId}`, { params: { owner, repo } });
  return data;
};

export const getRunJobs = async (owner, repo, runId) => {
  const { data } = await api.get(`/github/runs/${runId}/jobs`, { params: { owner, repo } });
  return data;
};

export const getJobLogs = async (owner, repo, jobId) => {
  const { data } = await api.get(`/github/jobs/${jobId}/logs`, { params: { owner, repo } });
  return data;
};

export const getRunLogs = async (owner, repo, runId) => {
  const { data } = await api.get(`/github/runs/${runId}/logs`, { 
    params: { owner, repo },
    responseType: 'blob' // we are getting a zip file
  });
  return data;
};

export const rerunWorkflow = async (owner, repo, runId) => {
  const { data } = await api.post(`/github/runs/${runId}/rerun`, null, { params: { owner, repo } });
  return data;
};

export const cancelWorkflow = async (owner, repo, runId) => {
  const { data } = await api.post(`/github/runs/${runId}/cancel`, null, { params: { owner, repo } });
  return data;
};
