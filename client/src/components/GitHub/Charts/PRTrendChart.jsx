import { useMemo } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function PRTrendChart({ pullRequests }) {
  const theme = useTheme();
  
  const data = useMemo(() => {
    if (!pullRequests || pullRequests.length === 0) return [];
    
    // Group PRs by day and status
    const activity = {};
    pullRequests.forEach(pr => {
      const date = dayjs(pr.createdAt).format("MMM DD");
      if (!activity[date]) {
        activity[date] = { date, open: 0, closed: 0 };
      }
      if (pr.state === "open") activity[date].open += 1;
      else activity[date].closed += 1;
    });

    return Object.values(activity).reverse();
  }, [pullRequests]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Pull Request Trend
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {data.length === 0 ? (
          <Typography align="center" color="text.secondary">No Pull Request activity to display.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" name="Opened" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" name="Closed/Merged" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
