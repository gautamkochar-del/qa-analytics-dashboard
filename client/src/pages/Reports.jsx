import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Button, IconButton, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupIcon from '@mui/icons-material/Group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const reportTypes = [
  { id: 'executive', title: 'Executive Summary', icon: <PictureAsPdfIcon />, color: '#ef4444' },
  { id: 'sprint', title: 'Sprint Summary', icon: <AssessmentIcon />, color: '#3b82f6' },
  { id: 'automation', title: 'Automation Report', icon: <SpeedIcon />, color: '#10b981' },
  { id: 'bug_aging', title: 'Bug Aging Report', icon: <BugReportIcon />, color: '#f59e0b' },
  { id: 'team', title: 'Team Productivity', icon: <GroupIcon />, color: '#8b5cf6' },
  { id: 'release', title: 'Release Readiness', icon: <RocketLaunchIcon />, color: '#ec4899' }
];

export default function Reports() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    { type: 'Executive Summary', frequency: 'Weekly', time: 'Monday 08:00 AM', status: 'Active' },
    { type: 'Automation Report', frequency: 'Daily', time: 'Every day 09:00 AM', status: 'Active' }
  ]);
  const [form, setForm] = useState({ reportType: 'executive', frequency: 'Weekly', email: '' });

  const handleSchedule = () => {
    setScheduledReports([...scheduledReports, {
      type: reportTypes.find(r => r.id === form.reportType).title,
      frequency: form.frequency,
      time: form.frequency === 'Daily' ? '09:00 AM' : 'Monday 08:00 AM',
      status: 'Active'
    }]);
    setScheduleOpen(false);
  };

  const handleDownload = (title) => {
    const blob = new Blob([`Dummy PDF content for ${title}`], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Report.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Advanced Reports</Typography>
        <Button variant="contained" color="primary" startIcon={<ScheduleIcon />} onClick={() => setScheduleOpen(true)}>
          Schedule New Report
        </Button>
      </Box>

      <Typography variant="h6" fontWeight={700} mb={3}>Generate Report</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {reportTypes.map(report => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card 
              onClick={() => handleDownload(report.title)}
              sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${report.color}15`, color: report.color }}>
                  {report.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>{report.title}</Typography>
                  <Typography variant="body2" color="text.secondary">PDF Export</Typography>
                </Box>
                <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleDownload(report.title); }}>
                  <PictureAsPdfIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Active Scheduled Reports</Typography>
        <List disablePadding>
          {scheduledReports.map((report, idx) => (
            <ListItem key={idx} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, mb: 1, py: 2 }}>
              <ListItemIcon>
                <ScheduleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography fontWeight={700}>{report.type}</Typography>}
                secondary={`Sent ${report.frequency} • ${report.time}`}
              />
              <Chip label={report.status} color="success" size="small" icon={<CheckCircleIcon />} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Schedule Automated Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField select label="Report Type" fullWidth value={form.reportType} onChange={e => setForm({...form, reportType: e.target.value})}>
              {reportTypes.map(r => <MenuItem key={r.id} value={r.id}>{r.title}</MenuItem>)}
            </TextField>
            <TextField select label="Frequency" fullWidth value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </TextField>
            <TextField label="Email Recipients (comma separated)" fullWidth value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="team@company.com" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setScheduleOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSchedule}>Schedule</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
