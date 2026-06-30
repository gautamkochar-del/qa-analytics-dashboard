import { useEffect, useState } from "react";
import * as reportApi from "../api/reportApi";
import useDebounce from "./useDebounce";

export default function useReports() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  
  const [severityData, setSeverityData] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);
  const [executionTrend, setExecutionTrend] = useState([]);
  const [bugTrend, setBugTrend] = useState([]);
  const [filters, setFilters] = useState({
    project: "",
    status: "",
    from: "",
    to: "",
});

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
        ...prev,
        [field]: value,
    }));
};

  const resetFilters = () => {
    setFilters({
        project: "",
        status: "",
        from: "",
        to: "",
    });
};
  
  const debouncedFilters = useDebounce(filters, 500);

  const loadReports = async () => {
    try {
      setLoading(true);

      const params = {
        project: debouncedFilters.project || undefined,
        status: debouncedFilters.status || undefined,
        from: debouncedFilters.from || undefined,
        to: debouncedFilters.to || undefined,
      };

      const [summaryObj, passFail, severity, projects, execution, bugs] = await Promise.all([
        reportApi.getSummary(params),
        reportApi.getPassFailChart(params),
        reportApi.getBugSeverityChart(params),
        reportApi.getProjectSummary(params),
        reportApi.getExecutionTrend(params),
        reportApi.getBugTrend(params),
      ]);

      setSummary(summaryObj);
      setChartData(passFail);
      setSeverityData(severity);
      setProjectSummary(projects);
      setExecutionTrend(execution);
      setBugTrend(bugs);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [debouncedFilters]);

  return {
    summary,
    chartData,
    severityData,

    projectSummary,
    filteredProjectSummary: projectSummary,
    filteredExecutionTrend: executionTrend,
    filteredBugTrend: bugTrend,

    filters,
    updateFilter,
    resetFilters,

    loading,
    error,
    refreshReports: loadReports,
  };
}
