import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as bugApi from "../api/bugApi";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import useDebounce from "./useDebounce";

export default function useBugs() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [projectId, setProjectId] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bugs", { page, limit, projectId, severity, status, search: debouncedSearch, sortBy, sortOrder }],
    queryFn: async () => {
      const params = { page, limit, sortBy, sortOrder };
      if (projectId) params.projectId = projectId;
      if (severity) params.severity = severity;
      if (status) params.status = status;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await bugApi.getBugs(params);
      return response;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!socket) return;
    
    const handleDashboardUpdate = (event) => {
      if (event.type === "bug") {
        queryClient.invalidateQueries({ queryKey: ["bugs"] });
      }
    };

    socket.on("dashboardUpdate", handleDashboardUpdate);
    return () => socket.off("dashboardUpdate", handleDashboardUpdate);
  }, [socket, queryClient]);

  return {
    bugs: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error ? error.message : "",
    page,
    limit,
    projectId,
    severity,
    status,
    search,
    sortBy,
    sortOrder,
    setPage,
    setLimit: (newLimit) => {
      setLimit(newLimit);
      setPage(1);
    },
    setProjectId,
    setSeverity,
    setStatus,
    setSearch,
    setSortBy,
    setSortOrder,
    refreshBugs: refetch,
  };
}
