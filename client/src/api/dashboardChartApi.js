const API_URL = "http://localhost:5000/api/dashboard/charts";

const fetchChart = async (endpoint) => {
  const response = await fetch(`${API_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
};

export const getPassFailChart = () =>
  fetchChart("pass-fail");

export const getExecutionTrend = () =>
  fetchChart("execution-trend");

export const getBugSeverity = () =>
  fetchChart("bug-severity");
