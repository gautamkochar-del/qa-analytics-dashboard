import * as analyticsService from "../services/analyticsService.js";

export const getExecutionHeatmap = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const heatmap = await analyticsService.getExecutionHeatmap(days);
    res.json(heatmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load execution heatmap" });
  }
};

export const getFlakyTests = async (req, res) => {
  try {
    const flaky = await analyticsService.getFlakyTests();
    res.json(flaky);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load flaky tests" });
  }
};

export const getDurationTrends = async (req, res) => {
  try {
    const trends = await analyticsService.getDurationTrends();
    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load duration trends" });
  }
};

export const getBugResolutionStats = async (req, res) => {
  try {
    const stats = await analyticsService.getBugResolutionStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load bug resolution stats" });
  }
};
