import { useMemo } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

export default function ContributorsChart({ commits }) {
  const data = useMemo(() => {
    if (!commits || commits.length === 0) return [];
    
    const activity = {};
    commits.forEach(commit => {
      const author = commit.author;
      activity[author] = (activity[author] || 0) + 1;
    });

    return Object.entries(activity)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // top 10
  }, [commits]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Top Contributors (Recent)
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {data.length === 0 ? (
          <Typography align="center" color="text.secondary">No contributors data to display.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Commits`, "Contributions"]} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
