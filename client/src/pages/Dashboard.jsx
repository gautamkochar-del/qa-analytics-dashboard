import { useEffect } from "react";
import {
  Box, Grid, Paper, Typography, Alert, IconButton, } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import useDashboard from "../hooks/useDashboard";
import { useSocket } from "../context/SocketContext";

import DashboardCards from "../components/Dashboard/DashboardCards";
import PassFailChart from "../components/Dashboard/PassFailChart";
import ExecutionTrendChart from "../components/Dashboard/ExecutionTrendChart";
import BugSeverityChart from "../components/Dashboard/BugSeverityChart";
import RecentTestRuns from "../components/Dashboard/RecentTestRuns";
import RecentBugs from "../components/Dashboard/RecentBugs";
import ProjectHealth from "../components/Dashboard/ProjectHealth";
import ActivityTimeline from "../components/Dashboard/ActivityTimeline";
import SkeletonCards from "../components/Common/SkeletonCards";
import SkeletonTable from "../components/Common/SkeletonTable";

export default function Dashboard() {
  const {
    summary, recentRuns, recentBugs, projectHealth, activity, passFailData, executionTrend, bugSeverity, loading, error, refreshDashboard, } = useDashboard();

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleDashboardUpdate = () => {
      refreshDashboard();
    };
    socket.on("dashboardUpdate", handleDashboardUpdate);
    return () => {
      socket.off("dashboardUpdate", handleDashboardUpdate);
    };
  }, [socket, refreshDashboard]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          QA Analytics Dashboard
        </Typography>

        <IconButton onClick={refreshDashboard} title="Refresh Dashboard">
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box>
          <SkeletonCards count={4} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{xs: 12, md: 6}}>
              <SkeletonTable rows={4} cols={4} />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <SkeletonTable rows={4} cols={4} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <DashboardCards summary={summary} />

          {/* Recent Test Runs */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{xs: 12, md: 6}}>
              <RecentTestRuns runs={recentRuns} />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <RecentBugs bugs={recentBugs} />
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={12}>
              <ProjectHealth projects={projectHealth} />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{xs: 12, md: 6}}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Pass vs Fail
                </Typography>
                <PassFailChart data={passFailData} />
              </Paper>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Execution Trend
                </Typography>
                <ExecutionTrendChart data={executionTrend} />
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Bug Severity
                </Typography>
                <BugSeverityChart data={bugSeverity} />
              </Paper>
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={12}>
              <ActivityTimeline activity={activity} />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
