import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = Array.from({ length: 20 }, (_, i) => ({
  build: `#${4873 + i}`,
  success: Math.floor(Math.random() * 80) + 20,
  failed: Math.floor(Math.random() * 10),
  unstable: Math.floor(Math.random() * 5),
}));

export default function BuildHistoryChart() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Build History (Last 20)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="build" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" name="Success" stackId="a" fill="#4CAF50" />
            <Bar dataKey="unstable" name="Unstable" stackId="a" fill="#FFC107" />
            <Bar dataKey="failed" name="Failed" stackId="a" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
