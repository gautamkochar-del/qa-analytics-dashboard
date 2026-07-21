import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BugReportIcon from '@mui/icons-material/BugReport';
import FoundationIcon from '@mui/icons-material/Foundation';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const kpis = [
  { title: "Projects", value: "12", icon: <FolderIcon />, color: "#3b82f6" },
  { title: "Automation", value: "82%", icon: <SpeedIcon />, color: "#10b981" },
  { title: "Release Readiness", value: "94%", icon: <CheckCircleIcon />, color: "#8b5cf6" },
  { title: "Critical Bugs", value: "5", icon: <BugReportIcon />, color: "#ef4444" },
  { title: "Build Stability", value: "97%", icon: <FoundationIcon />, color: "#f59e0b" },
  { title: "Deployment Frequency", value: "18/mo", icon: <RocketLaunchIcon />, color: "#ec4899" },
];

const mockReleaseData = [
  { name: 'Sprint 15', readiness: 75 },
  { name: 'Sprint 16', readiness: 82 },
  { name: 'Sprint 17', readiness: 88 },
  { name: 'Sprint 18', readiness: 94 },
];

const mockDeploymentData = [
  { name: 'Week 1', deployments: 3 },
  { name: 'Week 2', deployments: 5 },
  { name: 'Week 3', deployments: 4 },
  { name: 'Week 4', deployments: 6 },
];

export default function ExecutiveDashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Executive Overview</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${kpi.color}15`, color: kpi.color, mb: 2 }}>
                  {React.cloneElement(kpi.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{kpi.value}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{kpi.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', p: 2 }}>
            <Typography variant="h6" fontWeight="700" mb={3}>Release Readiness Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockReleaseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="readiness" stroke="#8b5cf6" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', p: 2 }}>
            <Typography variant="h6" fontWeight="700" mb={3}>Deployment Frequency</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockDeploymentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deployments" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
