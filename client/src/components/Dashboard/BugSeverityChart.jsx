import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts";

import {
  Card, CardContent, Typography, } from "@mui/material";

export default function BugSeverityChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Bug Severity
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#1976D2"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
