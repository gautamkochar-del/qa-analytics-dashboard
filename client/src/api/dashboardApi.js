import api from "./axios";

export const getDashboard = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const getDashboardSummary = getDashboard;

export const getRecentTestRuns = async () => {
  const { data } = await api.get("/dashboard/recent-test-runs");
  return data;
};

export const getRecentBugs = async () => {
  const { data } = await api.get("/dashboard/recent-bugs");
  return data;
};

export const getProjectHealth = async () => {
  const { data } = await api.get("/dashboard/project-health");
  return data;
};

export const getRecentActivity = async () => {
  const { data } = await api.get("/dashboard/activity");
  return data;
};

export const getPassFailChart = async () => {
  const { data } = await api.get("/dashboard/charts/pass-fail");
  return data;
};

export const getExecutionTrend = async () => {
  const { data } = await api.get("/dashboard/charts/execution-trend");
  return data;
};

export const getBugSeverity = async () => {
  const { data } = await api.get("/dashboard/charts/bug-severity");
  return data;
};
