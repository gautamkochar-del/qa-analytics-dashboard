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

    const handleLiveEvent = (event) => {
      queryClient.setQueryData(["dashboard"], (oldData) => {
        if (!oldData) return oldData;
        let newData = { ...oldData };
        
        if (event.type === 'testrun') {
          const newRun = {
            id: Date.now(),
            project: event.project || "QA Dashboard",
            passRate: event.status === 'PASSED' ? 100 : (event.status === 'FAILED' ? 0 : 50),
            executionDate: new Date().toISOString(),
          };
          newData.recentRuns = [newRun, ...newData.recentRuns].slice(0, 5);
        }
        
        if (event.type === 'bug') {
          const newBug = {
            id: Date.now(),
            title: event.title || 'New Bug',
            project: event.project || "QA Dashboard",
            severity: event.severity || 'High',
            status: 'Open',
            assignee: 'Unassigned',
          };
          newData.recentBugs = [newBug, ...newData.recentBugs].slice(0, 5);
        }

        return newData;
      });
    };

    socket.on("dashboardUpdate", handleDashboardUpdate);
    socket.on("liveEvent", handleLiveEvent);
    
    return () => {
      socket.off("dashboardUpdate", handleDashboardUpdate);
      socket.off("liveEvent", handleLiveEvent);
    };
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
