import * as dashboardService from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    res.json(await dashboardService.getDashboardSummary());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const getPassFailChart = async (req, res) => {
  try {
    res.json(await dashboardService.getPassFailChart());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load chart" });
  }
};

export const getExecutionTrend = async (req, res) => {
  try {
    res.json(await dashboardService.getExecutionTrend());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load trend" });
  }
};

export const getBugSeverity = async (req, res) => {
  try {
    res.json(await dashboardService.getBugSeverity());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load bug severity" });
  }
};

export const getRecentTestRuns = async (req, res) => {
  try {
    res.json(await dashboardService.getRecentTestRuns());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load recent test runs" });
  }
};

export const getRecentBugs = async (req, res) => {
  try {
    res.json(await dashboardService.getRecentBugs());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load recent bugs" });
  }
};

export const getProjectHealth = async (req, res) => {
  try {
    res.json(await dashboardService.getProjectHealth());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load project health" });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    res.json(await dashboardService.getRecentActivity());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load activity" });
  }
};
