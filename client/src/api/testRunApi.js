import api from "./axios";

export const getTestRuns = async (params = {}) => {
  const { data } = await api.get("/test-runs", { params });
  return data;
};

export const getTestRun = async (id) => {
  const { data } = await api.get(`/test-runs/${id}`);
  return data;
};

export const createTestRun = async (testRunData) => {
  const { data } = await api.post("/test-runs", testRunData);
  return data;
};

export const updateTestRun = async (id, testRunData) => {
  const { data } = await api.put(`/test-runs/${id}`, testRunData);
  return data;
};

export const deleteTestRun = async (id) => {
  const { data } = await api.delete(`/test-runs/${id}`);
  return data;
};
