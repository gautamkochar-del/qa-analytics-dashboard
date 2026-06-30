import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboardApi";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";

export default function useDashboard() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [
        summary,
        recentRuns,
        recentBugs,
        projectHealth,
        activity,
        passFailData,
        executionTrend,
        bugSeverity,
      ] = await Promise.all([
        dashboardApi.getDashboard(),
        dashboardApi.getRecentTestRuns(),
        dashboardApi.getRecentBugs(),
        dashboardApi.getProjectHealth(),
        dashboardApi.getRecentActivity(),
        dashboardApi.getPassFailChart(),
        dashboardApi.getExecutionTrend(),
        dashboardApi.getBugSeverity(),
      ]);

      return {
        summary,
        recentRuns,
        recentBugs,
        projectHealth,
        activity,
        passFailData,
        executionTrend,
        bugSeverity,
      };
    },
    staleTime: 60000,
  });

  useEffect(() => {
    if (!socket) return;
    
    const handleDashboardUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("dashboardUpdate", handleDashboardUpdate);
    return () => socket.off("dashboardUpdate", handleDashboardUpdate);
  }, [socket, queryClient]);

  return {
    summary: data?.summary || {},
    recentRuns: data?.recentRuns || [],
    recentBugs: data?.recentBugs || [],
    projectHealth: data?.projectHealth || [],
    activity: data?.activity || [],
    passFailData: data?.passFailData || [],
    executionTrend: data?.executionTrend || [],
    bugSeverity: data?.bugSeverity || [],
    loading: isLoading,
    error: error ? error.message : "",
    refreshDashboard: refetch,
  };
}
