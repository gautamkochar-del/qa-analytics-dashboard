import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, } from "recharts";

import {
  Card, CardContent, Typography, } from "@mui/material";

export default function ExecutionTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Execution Trend
        </Typography>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="passed"
              stroke="#4CAF50"
            />

            <Line
              type="monotone"
              dataKey="failed"
              stroke="#F44336"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
