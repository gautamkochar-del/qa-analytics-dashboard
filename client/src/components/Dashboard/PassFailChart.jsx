import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";

import {
  Card, CardContent, Typography, } from "@mui/material";

const COLORS = ["#4CAF50", "#F44336"];

export default function PassFailChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pass vs Fail
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
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
