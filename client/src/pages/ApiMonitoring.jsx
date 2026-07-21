import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import TimerIcon from '@mui/icons-material/Timer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockResponseData = [
  { time: '10:00', ms: 180 },
  { time: '10:05', ms: 210 },
  { time: '10:10', ms: 195 },
  { time: '10:15', ms: 420 },
  { time: '10:20', ms: 205 },
  { time: '10:25', ms: 215 },
];

const endpoints = [
  { path: '/api/login', ms: 210, availability: '99.98%', errors: '0.1%', status: 'Healthy' },
  { path: '/api/users/profile', ms: 340, availability: '99.90%', errors: '0.5%', status: 'Warning' },
  { path: '/api/payments/charge', ms: 850, availability: '98.40%', errors: '2.1%', status: 'Critical' },
  { path: '/api/dashboard/metrics', ms: 120, availability: '100%', errors: '0%', status: 'Healthy' }
];

export default function ApiMonitoring() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>API Monitoring</Typography>
        <Chip icon={<NetworkCheckIcon />} label="System Operational" color="success" sx={{ fontWeight: 700 }} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main' }}>
                <TimerIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" fontWeight={600}>Global Response Time</Typography>
                <Typography variant="h4" fontWeight={800}>210<Typography component="span" variant="h6" color="text.secondary">ms</Typography></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.50', color: 'success.main' }}>
                <NetworkCheckIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" fontWeight={600}>Overall Availability</Typography>
                <Typography variant="h4" fontWeight={800}>99.98<Typography component="span" variant="h6" color="text.secondary">%</Typography></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'error.50', color: 'error.main' }}>
                <ErrorOutlineIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" fontWeight={600}>Error Rate</Typography>
                <Typography variant="h4" fontWeight={800}>0.1<Typography component="span" variant="h6" color="text.secondary">%</Typography></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Response Time Trend (/api/login)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockResponseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Endpoint</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Response Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Errors</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((ep) => (
                <TableRow key={ep.path} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{ep.path}</TableCell>
                  <TableCell>{ep.ms}ms</TableCell>
                  <TableCell>{ep.availability}</TableCell>
                  <TableCell>{ep.errors}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={ep.status} 
                      color={ep.status === 'Healthy' ? 'success' : ep.status === 'Warning' ? 'warning' : 'error'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
