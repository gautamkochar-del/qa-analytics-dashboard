import { useMemo } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#f1e05a", "#3178c6", "#e34c26", "#563d7c", "#b07219", "#ffac45", "#2b7489"];

export default function LanguagesPieChart({ languages }) {
  const data = useMemo(() => {
    if (!languages || Object.keys(languages).length === 0) return [];
    
    // languages object looks like: { JavaScript: 12345, HTML: 678 }
    const entries = Object.entries(languages);
    
    // Sort and take top 7 to avoid clutter
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 7);
    
    // Optional: sum up the rest as "Other"
    if (sorted.length > 7) {
      const others = sorted.slice(7).reduce((acc, curr) => acc + curr[1], 0);
      top.push(["Other", others]);
    }

    return top.map(([name, value]) => ({ name, value }));
  }, [languages]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Languages
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {data.length === 0 ? (
          <Typography align="center" color="text.secondary">No language data to display.</Typography>
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
              <Tooltip formatter={(value) => [`${value} bytes`, "Size"]} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
