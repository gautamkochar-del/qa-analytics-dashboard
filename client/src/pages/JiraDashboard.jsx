import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, Button, Chip } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';

const mockJiraIssues = [
  { key: 'QA-245', summary: 'Login API returns 500 intermittently', status: 'In Progress', type: 'Bug', priority: 'High' },
  { key: 'QA-248', summary: 'Update regression suite for v2.0', status: 'Open', type: 'Task', priority: 'Medium' },
  { key: 'QA-251', summary: 'UI misaligned on mobile dashboard', status: 'Done', type: 'Bug', priority: 'Low' },
  { key: 'QA-252', summary: 'Implement Redis caching for test runs', status: 'In Review', type: 'Story', priority: 'High' }
];

export default function JiraDashboard() {
  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Jira Dashboard</Typography>
        <Button 
          variant="contained" 
          startIcon={<SyncIcon sx={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />} 
          onClick={handleSyncAll}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : 'Sync All Issues'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography color="text.secondary" fontWeight={600} gutterBottom>Total Synced Issues</Typography>
              <Typography variant="h3" fontWeight={800} color="primary.main">142</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography color="text.secondary" fontWeight={600} gutterBottom>Open Defects in Jira</Typography>
              <Typography variant="h3" fontWeight={800} color="error.main">24</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography color="text.secondary" fontWeight={600} gutterBottom>Pending QA Review</Typography>
              <Typography variant="h3" fontWeight={800} color="warning.main">8</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Recent Linked Issues</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mockJiraIssues.map(issue => (
            <Box key={issue.key} sx={{ p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {issue.type === 'Bug' ? <BugReportIcon color="error" /> : <AssignmentIcon color="primary" />}
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>{issue.key} - {issue.summary}</Typography>
                  <Typography variant="body2" color="text.secondary">Priority: {issue.priority}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={issue.status} color={issue.status === 'Done' ? 'success' : issue.status === 'In Progress' ? 'primary' : 'default'} />
                <Button size="small" variant="outlined">Update</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
