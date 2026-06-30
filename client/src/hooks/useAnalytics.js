import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export default function useAnalytics() {
  const [heatmap, setHeatmap] = useState([]);
  const [flaky, setFlaky] = useState([]);
  const [trends, setTrends] = useState([]);
  const [bugs, setBugs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [heatmapRes, flakyRes, trendsRes, bugsRes] = await Promise.all([
        api.get("/analytics/execution-heatmap"),
        api.get("/analytics/flaky-tests"),
        api.get("/analytics/duration-trends"),
        api.get("/analytics/bug-resolution"),
      ]);

      setHeatmap(heatmapRes.data || []);
      setFlaky(flakyRes.data || []);
      setTrends(trendsRes.data || []);
      setBugs(bugsRes.data || null);
    } catch (err) {
      console.error("Failed to load analytics: ", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch analytics statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    heatmap,
    flaky,
    trends,
    bugs,
    loading,
    error,
    refreshAnalytics: loadAnalytics,
  };
}
