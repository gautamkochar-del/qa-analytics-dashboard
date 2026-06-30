import {
  Card, CardContent, Typography, } from "@mui/material";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from "recharts";

export default function ExecutionTrendChart({
  data, }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
        >
          Test Execution Trend
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="passed"
              stroke="#2e7d32"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="failed"
              stroke="#d32f2f"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
