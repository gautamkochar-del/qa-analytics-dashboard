import { useState } from "react";
import { Grid, Paper, Typography, Box, IconButton, Chip, Alert, LinearProgress, Card, CardContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BugReportIcon from '@mui/icons-material/BugReport';
import GroupIcon from '@mui/icons-material/Group';
import DnsIcon from '@mui/icons-material/Dns';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import useAnalytics from "../hooks/useAnalytics";
import SkeletonCards from "../components/Common/SkeletonCards";
import SkeletonTable from "../components/Common/SkeletonTable";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const CustomHeatmap = () => {
  const data = [
    { day: "Monday", count: 6, max: 10 },
    { day: "Tuesday", count: 8, max: 10 },
    { day: "Wednesday", count: 4, max: 10 },
    { day: "Thursday", count: 7, max: 10 },
    { day: "Friday", count: 5, max: 10 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {data.map((row) => (
        <Box key={row.day} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ width: 90, fontWeight: 600 }}>{row.day}</Typography>
          <Box sx={{ flex: 1, height: 16, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: `${(row.count / row.max) * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const MetricCard = ({ title, value, subtext, icon, color }) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>+4.2%</Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
      <Typography variant="caption" color="text.secondary">{subtext}</Typography>
    </CardContent>
  </Card>
);

export default function Analytics() {
  const { heatmap, flaky, trends, bugs, loading, error, refreshAnalytics } = useAnalytics();

  if (error) {
    return <Box sx={{ p: 2 }}><Alert severity="error">{error}</Alert></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Advanced Analytics</Typography>
        <IconButton onClick={refreshAnalytics} title="Refresh Analytics"><RefreshIcon /></IconButton>
      </Box>

      {loading ? (
        <Box>
          <SkeletonCards count={4} />
          <Box sx={{ mt: 4 }}><SkeletonTable rows={4} cols={5} /></Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Trend Analysis Metric Cards */}
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard title="Monthly Pass Rate" value="96.4%" subtext="Consistent over 30 days" icon={<CheckCircleIcon />} color="#10b981" />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard title="Automation Growth" value="+12%" subtext="New tests added this month" icon={<TrendingUpIcon />} color="#3b82f6" />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard title="Bug Trends" value="-18%" subtext="Fewer production escapes" icon={<BugReportIcon />} color="#ef4444" />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard title="Team Productivity" value="342" subtext="Executions / Engineer / Wk" icon={<GroupIcon />} color="#8b5cf6" />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard title="Env Stability" value="99.9%" subtext="Uptime across all pipelines" icon={<DnsIcon />} color="#f59e0b" />
          </Grid>

          {/* Activity Heatmap */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Weekly Execution Heatmap</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Visualizes the density of test suite executions mapped directly against the days of the week.
              </Typography>
              <CustomHeatmap />
            </Paper>
          </Grid>

          {/* Existing Bug Severity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Bug Severity Distribution</Typography>
              {!bugs || bugs.severityBreakdown.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography variant="body2" color="text.secondary">No bugs data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={bugs.severityBreakdown}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value"
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
          
        </Grid>
      )}
    </Box>
  );
}
