import api from "./axios";

export const getGitHubStatus = async () => {
  const { data } = await api.get("/github/status");
  return data;
};

export const connectGitHub = async (apiKey) => {
  const { data } = await api.post("/github/connect", { apiKey });
  return data;
};

export const disconnectGitHub = async () => {
  const { data } = await api.post("/github/disconnect");
  return data;
};

export const getGitHubProfile = async () => {
  const { data } = await api.get("/github/profile");
  return data;
};

export const getGitHubRepositories = async () => {
  const { data } = await api.get("/github/repository");
  return data;
};

export const getGitHubCommits = async (owner, repo) => {
  const { data } = await api.get(`/github/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  return data;
};

export const getGitHubPullRequests = async (owner, repo) => {
  const { data } = await api.get(`/github/pull-requests?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  return data;
};

export const getGitHubIssues = async (owner, repo) => {
  const { data } = await api.get(`/github/issues?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  return data;
};

export const getGitHubActions = async (owner, repo) => {
  const { data } = await api.get(`/github/actions?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  return data;
};

export const getGitHubLanguages = async (owner, repo) => {
  const { data } = await api.get(`/github/languages?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  return data;
};

export const runGitHubAction = async (payload) => {
  const { data } = await api.post(`/github/actions/run`, payload);
  return data;
};
