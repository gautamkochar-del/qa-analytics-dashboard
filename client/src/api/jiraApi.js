import api from "./axios";

export const syncBugs = async () => {
  const response = await api.post("/jira/sync");
  return response.data;
};

export const createIssue = async (bugId) => {
  const response = await api.post(`/jira/issue/${bugId}`);
  return response.data;
};

export const getIssueDetails = async (bugId) => {
  const response = await api.get(`/jira/issue/${bugId}`);
  return response.data;
};
