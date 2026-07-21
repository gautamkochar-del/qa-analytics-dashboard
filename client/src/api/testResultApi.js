import api from "./axios";

export const getTestCasesForRun = async (testRunId) => {
  const { data } = await api.get(`/test-results/run/${testRunId}`);
  return data;
};

export const getTestCaseById = async (id) => {
  const { data } = await api.get(`/test-results/${id}`);
  return data;
};

export const updateTestCase = async (id, updateData) => {
  const { data } = await api.put(`/test-results/${id}`, updateData);
  return data;
};
