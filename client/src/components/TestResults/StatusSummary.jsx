import React from "react";
import { Grid, Paper, Typography, Box, Chip, Divider } from "@mui/material";

export default function StatusSummary({ run }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "passed": return "success";
      case "failed": return "error";
      case "running": return "primary";
      default: return "default";
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    return seconds > 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Primary Details Row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <Chip label={run.project?.name || "No Project"} variant="outlined" />
        <Chip label={run.environment || "N/A"} variant="outlined" />
        <Chip label={run.status?.toUpperCase() || "UNKNOWN"} color={getStatusColor(run.status)} />
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          Started: {new Date(run.executionDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </Typography>
      </Box>

      {/* Summary Cards Row */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", borderTop: "4px solid", borderColor: "success.main" }}>
            <Typography variant="h3" color="success.main" fontWeight={700}>{run.passed || 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>Passed</Typography>
          </Paper>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", borderTop: "4px solid", borderColor: run.failed > 0 ? "error.main" : "text.secondary" }}>
            <Typography variant="h3" color={run.failed > 0 ? "error.main" : "text.secondary"} fontWeight={700}>{run.failed || 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>Failed</Typography>
          </Paper>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", borderTop: "4px solid", borderColor: "warning.main" }}>
            <Typography variant="h3" color="warning.main" fontWeight={700}>{run.skipped || 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>Skipped</Typography>
          </Paper>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", borderTop: "4px solid", borderColor: "primary.main" }}>
            <Typography variant="h3" color="primary.main" fontWeight={700}>{formatDuration(run.duration)}</Typography>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>Duration</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
