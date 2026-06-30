import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, Card, CardContent, Chip, CircularProgress, List, ListItem, ListItemText, ListItemIcon, Divider, } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import * as integrationApi from "../api/integrationApi";
import useTestRuns from "../hooks/useTestRuns";
import { useSocket } from "../context/SocketContext";

export default function CicdDashboard() {
  const [integrations, setIntegrations] = useState([]);
  const [loadingInts, setLoadingInts] = useState(true);

  // We reuse our existing test runs hook to simulate pipeline status
  // since test runs represent executed suites which often run in CI
  const { testRuns, loading: loadingRuns, refreshTestRuns } = useTestRuns({ limit: 5 });

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await integrationApi.getIntegrations();
        setIntegrations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInts(false);
      }
    };
    fetchIntegrations();
  }, []);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (data?.type === "testRun") refreshTestRuns();
    };
    socket.on("dashboardUpdate", handleUpdate);
    return () => socket.off("dashboardUpdate", handleUpdate);
  }, [socket, refreshTestRuns]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          CI/CD Pipelines
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left column: Pipeline Status Feed */}
        <Grid size={{xs: 12, md: 8}}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Builds & Executions
            </Typography>

            {loadingRuns ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {testRuns.map((run, index) => (
                  <div key={run.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        {run.status === "passed" ? (
                          <CheckCircleIcon color="success" />
                        ) : run.status === "failed" ? (
                          <ErrorIcon color="error" />
                        ) : (
                          <PlayArrowIcon color="primary" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {run.suiteName}
                            </Typography>
                            <Chip
                              label={run.environment}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.7rem" }}
                            />
                            {run.githubRunId && (
                              <Chip
                                label={`GitHub #${run.githubRunId}`}
                                size="small"
                                sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#24292e", color: "white" }}
                              />
                            )}
                            {run.jenkinsBuildUrl && (
                              <Chip
                                label={`Jenkins Build`}
                                size="small"
                                sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#d32f2f", color: "white" }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Executed on {new Date(run.executionDate).toLocaleString()} in Project: {run.project?.name}
                            <br />
                            Total Tests: {run.total} | Passed: {run.passed} | Failed: {run.failed}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < testRuns.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right column: Active Integrations */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Active Connections
            </Typography>

            {loadingInts ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : integrations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No integrations configured. Set them up in the Integrations page.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {integrations.map((int) => (
                  <Grid size={12} key={int.id}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {int.name}
                          </Typography>
                          <Chip
                            label={int.provider}
                            size="small"
                            color={int.provider === "Jira" ? "primary" : int.provider === "Jenkins" ? "warning" : "default"}
                          />
                        </Box>
                        {int.url && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            {int.url}
                          </Typography>
                        )}
                        <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: "block", fontWeight: 600 }}>
                          ● Connected
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
