import { useState } from "react";
import {
  Grid, Paper, Typography, Box, IconButton, Chip, Alert, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, } from "recharts";

import useAnalytics from "../hooks/useAnalytics";
import SkeletonCards from "../components/Common/SkeletonCards";
import SkeletonTable from "../components/Common/SkeletonTable";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const {
    heatmap, flaky, trends, bugs, loading, error, refreshAnalytics, } = useAnalytics();

  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  const flakyColumns = [
    { field: "suite", headerName: "Suite/Spec Name", flex: 1, minWidth: 200, renderCell: (params) => <Typography fontWeight={600}>{params.value}</Typography> },
    { field: "project", headerName: "Project", flex: 1, minWidth: 150 },
    { field: "totalRuns", headerName: "Total Runs", width: 120, align: "center", headerAlign: "center" },
    { field: "failures", headerName: "Failed Runs", width: 120, align: "center", headerAlign: "center" },
    { field: "instabilityRate", headerName: "Instability Index", width: 150, align: "center", headerAlign: "center", renderCell: (params) => (
        <Typography variant="body2" fontWeight={650} color={params.value > 50 ? "error.main" : "warning.main"}>
          {params.value}%
        </Typography>
      )
    },
    { field: "status", headerName: "Status", width: 150, align: "right", headerAlign: "right", renderCell: (params) => (
        <Chip
          label={params.row.instabilityRate > 50 ? "High Risk" : "Moderate Risk"}
          color={params.row.instabilityRate > 50 ? "error" : "warning"}
          size="small"
        />
      )
    }
  ];


  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Advanced Analytics
        </Typography>
        <IconButton onClick={refreshAnalytics} title="Refresh Analytics">
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box>
          <SkeletonCards count={3} />
          <Box sx={{ mt: 4 }}>
            <SkeletonTable rows={4} cols={5} />
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Heatmap/Daily Activity */}
          <Grid size={{xs: 12, md: 7}}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Test Runs Activity (Daily)
              </Typography>
              {heatmap.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography variant="body2" color="text.secondary">No execution activity found</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={heatmap}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Runs Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="totalTests" name="Total Tests Run" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Bug Severity Distribution */}
          <Grid size={{xs: 12, md: 5}}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Bug Severity Distribution
              </Typography>
              {!bugs || bugs.severityBreakdown.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography variant="body2" color="text.secondary">No bugs data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={bugs.severityBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {bugs.severityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Test Durations Performance */}
          <Grid size={{xs: 12, md: 6}}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 380 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Average Execution Duration Trend
              </Typography>
              {trends.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={260}>
                  <Typography variant="body2" color="text.secondary">No duration metrics found</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis label={{ value: 'Avg Seconds', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}s (${formatDuration(value)})`, "Duration"]} />
                    <Legend />
                    <Line type="monotone" dataKey="avgDuration" name="Avg Runtime" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Bugs Module Breakdown */}
          <Grid size={{xs: 12, md: 6}}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 380 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Bug Concentration by Service / Module
              </Typography>
              {!bugs || bugs.moduleDistribution.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={260}>
                  <Typography variant="body2" color="text.secondary">No bugs module distribution found</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bugs.moduleDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="module" type="category" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Open" stackId="a" fill="#ef4444" name="Open" />
                    <Bar dataKey="Resolved" stackId="a" fill="#c084fc" name="Resolved/Closed" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Flaky Test Indicators */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                Flaky Automation Suites Detection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Identifies suites toggling repeatedly between pass/fail status in execution history. Higher Instability Score suggests flaky code or environmental defects.
              </Typography>

              {flaky.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">Excellent! No flaky tests detected.</Typography>
                </Box>
              ) : (
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Box sx={{ minWidth: 800, height: 400 }}>
                    <DataGrid
                      rows={flaky}
                      columns={flakyColumns}
                      getRowId={(row) => row.suite + row.project}
                      pageSizeOptions={[5, 10, 25]}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      disableRowSelectionOnClick
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
