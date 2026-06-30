import api from "./axios";

export const getSummary = async (params = {}) => {
  const response = await api.get("/reports/summary", { params });
  return response.data;
};

export const getPassFailChart = async (params = {}) => {
  const response = await api.get("/reports/pass-fail", { params });
  return response.data;
};

export const getBugSeverityChart = async (params = {}) => {
  const response = await api.get("/reports/bug-severity", { params });
  return response.data;
};

export const getProjectSummary = async (params = {}) => {
  const response = await api.get(
    "/reports/project-summary", { params }
  );

  return response.data;
};

export const getExecutionTrend = async (params = {}) => {
  const response = await api.get("/reports/execution-trend", { params });
  return response.data;
};

export const getBugTrend = async (params = {}) => {
  const response = await api.get("/reports/bug-trend", { params });
  return response.data;
};
