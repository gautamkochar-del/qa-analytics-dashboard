import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function ExecutionLog({ testCase }) {
  // If no log is present in DB, display the requested mock representation
  const defaultLog = [
    { time: "10:31", message: "Starting" },
    { time: "10:32", message: "Click Login" },
    { time: "10:33", message: "Open Dashboard" },
    { time: "10:34", message: "Assertion Failed", error: true },
    { time: "10:34", message: "Screenshot Saved" },
  ];

  // If the backend has a raw string logFile, we split it, otherwise we map the mock.
  // We'll prioritize rendering the styled mock log to match the requested visual
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <ReceiptLongIcon fontSize="small" /> Execution Trace
      </Typography>
      
      <Paper 
        variant="outlined" 
        sx={{ 
          bgcolor: "#1e1e1e", 
          color: "#d4d4d4", 
          p: 2, 
          borderRadius: 2, 
          fontFamily: "'Fira Code', 'Roboto Mono', monospace", 
          overflowX: "auto", 
          maxHeight: 400 
        }}
      >
        {testCase?.logFile ? (
          <Box sx={{ whiteSpace: "pre-wrap" }}>{testCase.logFile}</Box>
        ) : (
          <Box>
            {defaultLog.map((log, index) => (
              <Box key={index} sx={{ display: "flex", gap: 3, mb: 1.5, opacity: 0.9 }}>
                <Typography variant="body2" sx={{ color: "#858585", minWidth: "45px" }}>
                  {log.time}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: log.error ? "#f48771" : "#d4d4d4", 
                    fontWeight: log.error ? 600 : 400 
                  }}
                >
                  {log.message}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
          Download Full Log
        </Button>
      </Box>
    </Box>
  );
}
