import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";

import {
  Card, CardContent, Typography, } from "@mui/material";

const COLORS = ["#4CAF50", "#F44336", "#FFC107", "#9E9E9E", "#2196F3"];

export default function StatusChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Status Distribution
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
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
