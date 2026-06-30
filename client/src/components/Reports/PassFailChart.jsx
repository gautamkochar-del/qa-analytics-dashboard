import {
  Card, CardContent, Typography, } from "@mui/material";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, } from "recharts";

export default function PassFailChart({
  data, }) {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
        >
          Pass vs Failed Tests
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={data}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#1976d2"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
