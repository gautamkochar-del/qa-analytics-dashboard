import {
  Card, CardContent, Typography, } from "@mui/material";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";

const COLORS = [
  "#d32f2f", "#ed6c02", "#0288d1", "#2e7d32", ];

export default function BugSeverityChart({
  data, }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
        >
          Bug Severity Distribution
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
