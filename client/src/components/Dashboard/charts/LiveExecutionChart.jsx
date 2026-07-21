import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, } from "recharts";

import { useState } from "react";
import {
  Card, CardContent, Typography, Box, Select, MenuItem, FormControl, } from "@mui/material";

export default function ExecutionChart({ data }) {
  const [filter, setFilter] = useState("last7days");

  if (!data || data.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Test Execution Trend
          </Typography>
          <FormControl size="small">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
            >
              <MenuItem value="7days">7 Days</MenuItem>
              <MenuItem value="30days">30 Days</MenuItem>
              <MenuItem value="sprint">Sprint</MenuItem>
              <MenuItem value="quarter">Quarter</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
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
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="failed"
              stroke="#F44336"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="skipped"
              stroke="#FFC107"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
