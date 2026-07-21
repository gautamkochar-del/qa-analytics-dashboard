import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";

export default function RetryHistory({ testCase }) {
  // Use DB data if available, otherwise fallback to the requested structure to demonstrate the capability
  const mockRetries = [
    { attempt: 1, status: "FAILED" },
    { attempt: 2, status: "FAILED" },
    { attempt: 3, status: "PASSED" }
  ];

  const retryData = testCase?.retryHistory || mockRetries;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PASSED": return "success";
      case "FAILED": return "error";
      default: return "default";
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <TimelineIcon fontSize="small" /> Execution Retry Sequence
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {retryData.map((retry, index) => (
          <Paper 
            key={index} 
            variant="outlined" 
            sx={{ 
              p: 2, 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              borderRadius: 2,
              borderLeft: "4px solid",
              borderColor: retry.status === "PASSED" ? "success.main" : "error.main",
              bgcolor: "background.default"
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Retry {retry.attempt}
            </Typography>
            <Chip 
              label={retry.status} 
              color={getStatusColor(retry.status)} 
              size="small" 
              sx={{ fontWeight: 700 }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
