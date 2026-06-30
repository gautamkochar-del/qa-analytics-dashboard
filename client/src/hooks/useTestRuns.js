import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/testRunApi";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import useDebounce from "./useDebounce";

export default function useTestRuns() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("all");
  const [environment, setEnvironment] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("executionDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["testRuns", { page, limit, projectId, status, environment, search: debouncedSearch, sortBy, sortOrder }],
    queryFn: async () => {
      const params = { page, limit, sortBy, sortOrder };
      if (projectId) params.projectId = projectId;
      if (status !== "all") params.status = status;
      if (environment !== "all") params.environment = environment;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await api.getTestRuns(params);
      return response;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!socket) return;
    
    const handleDashboardUpdate = (event) => {
      if (event.type === "testRun") {
        queryClient.invalidateQueries({ queryKey: ["testRuns"] });
      }
    };

    socket.on("dashboardUpdate", handleDashboardUpdate);
    return () => socket.off("dashboardUpdate", handleDashboardUpdate);
  }, [socket, queryClient]);

  return {
    testRuns: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error ? error.message : "",
    page,
    limit,
    projectId,
    status,
    environment,
    search,
    sortBy,
    sortOrder,
    setPage,
    setLimit: (newLimit) => {
      setLimit(newLimit);
      setPage(1);
    },
    setProjectId,
    setStatus,
    setEnvironment,
    setSearch,
    setSortBy,
    setSortOrder,
    refreshTestRuns: refetch,
  };
}
