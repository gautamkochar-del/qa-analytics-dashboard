import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, LinearProgress, Stepper, Step, StepLabel, Chip, List, ListItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WarningIcon from '@mui/icons-material/Warning';

const deploymentSteps = ['QA Environment', 'UAT Environment', 'Production'];

const releaseIssues = [
  { id: 'QA-341', title: 'Payment timeout on 3G networks', status: 'Resolved', severity: 'High' },
  { id: 'QA-345', title: 'Analytics script blocking render', status: 'In Progress', severity: 'Critical' },
  { id: 'QA-350', title: 'Footer CSS misaligned in Safari', status: 'Open', severity: 'Low' },
];

export default function ReleaseManagement() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Release 3.4.0</Typography>
          <Typography variant="subtitle1" color="text.secondary">Scheduled for Friday, 10:00 PM</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<RocketLaunchIcon />}>Deploy to UAT</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Release Progress</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 3 }}>
                <Typography variant="body2" fontWeight={600}>Test Execution</Typography>
                <Typography variant="body2" fontWeight={700} color="success.main">85% Completed</Typography>
              </Box>
              <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 12, borderRadius: 6, mb: 4 }} />

              <Typography variant="h6" fontWeight={700} gutterBottom>Deployment Pipeline</Typography>
              <Box sx={{ mt: 3 }}>
                <Stepper activeStep={1} alternativeLabel>
                  {deploymentSteps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel StepIconProps={{ sx: { color: index <= 1 ? 'primary.main' : 'default' } }}>
                        <Typography fontWeight={index <= 1 ? 700 : 400}>{label}</Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <CheckCircleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" fontWeight={800} gutterBottom>Ready</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>QA Sign-off Complete</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Release Blockers & Issues</Typography>
        <List disablePadding>
          {releaseIssues.map((issue, idx) => (
            <React.Fragment key={issue.id}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  {issue.severity === 'Critical' ? <WarningIcon color="error" /> : <BugReportIcon color="warning" />}
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography fontWeight={600}>{issue.id} - {issue.title}</Typography>} 
                  secondary={`Severity: ${issue.severity}`} 
                />
                <Chip 
                  label={issue.status} 
                  size="small" 
                  color={issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'primary' : 'default'} 
                />
              </ListItem>
              {idx < releaseIssues.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
