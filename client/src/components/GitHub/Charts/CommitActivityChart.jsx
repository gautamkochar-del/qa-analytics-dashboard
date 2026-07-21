import { useMemo } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function CommitActivityChart({ commits }) {
  const theme = useTheme();
  
  const data = useMemo(() => {
    if (!commits || commits.length === 0) return [];
    
    // Group commits by day
    const activity = {};
    commits.forEach(commit => {
      const date = dayjs(commit.date).format("MMM DD");
      activity[date] = (activity[date] || 0) + 1;
    });

    return Object.keys(activity).reverse().map(date => ({
      date,
      count: activity[date]
    }));
  }, [commits]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Commit Activity
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {data.length === 0 ? (
          <Typography align="center" color="text.secondary">No commit activity to display.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke={theme.palette.primary.main} 
                fill={theme.palette.primary.light} 
                fillOpacity={0.3} 
                name="Commits" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
