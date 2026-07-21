import React, { useState } from "react";
import { Box, Typography, Chip, Grid, Card } from "@mui/material";
import ScreenshotViewer from "./ScreenshotViewer";
import VideoViewer from "./VideoViewer";
import ExecutionLog from "./ExecutionLog";
import RetryHistory from "./RetryHistory";

export default function TestResultDetails({ testCase }) {
  const [activeTab, setActiveTab] = useState("screenshot"); // "screenshot", "video", "log", "retry"

  if (!testCase) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.6 }}>
        <Typography variant="h6" color="text.secondary">
          Select a test case to view details
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "passed": return "success";
      case "failed": return "error";
      case "running": return "primary";
      default: return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {testCase.name}
      </Typography>
      
      <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
          <Chip 
            label={testCase.status?.toUpperCase()} 
            color={getStatusColor(testCase.status)} 
            size="small" 
            sx={{ mt: 0.5, fontWeight: 600 }}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
          <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
            {testCase.duration} sec
          </Typography>
        </Box>
      </Box>

      {testCase.status === "failed" && testCase.error && (
        <Box sx={{ mb: 4 }}>
          {testCase.error.toLowerCase().includes("expected") && (testCase.error.toLowerCase().includes("actual") || testCase.error.toLowerCase().includes("received")) ? (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "error.main" }}>
                AssertionError
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs: 12, sm: 6}}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: "#ecfdf5", borderColor: "success.light" }}>
                    <Typography variant="caption" color="success.main" fontWeight={700} sx={{ textTransform: "uppercase" }}>Expected</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1, fontFamily: "monospace" }}>
                      {testCase.error.match(/Expected[:\s]+([^\n]+)/i)?.[1] || "200"}
                    </Typography>
                  </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: "#fef2f2", borderColor: "error.light" }}>
                    <Typography variant="caption" color="error.main" fontWeight={700} sx={{ textTransform: "uppercase" }}>Received</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1, fontFamily: "monospace" }}>
                      {testCase.error.match(/(?:Actual|Received)[:\s]+([^\n]+)/i)?.[1] || "500"}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, bgcolor: "#24292e", color: "#f8f8f2", p: 2, borderRadius: 2, fontFamily: "monospace", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                {testCase.error}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: "error.main" }}>
                Error:
              </Typography>
              <Box sx={{ bgcolor: "#24292e", color: "#f8f8f2", p: 2, borderRadius: 2, fontFamily: "monospace", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                {testCase.error}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Action Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{xs: 12, sm: 3}}>
          <Card 
            variant="outlined" 
            onClick={() => setActiveTab("screenshot")}
            sx={{ 
              borderRadius: 2, textAlign: "center", p: 2, cursor: "pointer", 
              bgcolor: activeTab === "screenshot" ? "action.selected" : "background.paper",
              border: activeTab === "screenshot" ? "1px solid primary.main" : "",
              "&:hover": { bgcolor: "action.hover" } 
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color={activeTab === "screenshot" ? "primary.main" : "text.primary"}>Screenshot</Typography>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 3}}>
          <Card 
            variant="outlined" 
            onClick={() => setActiveTab("video")}
            sx={{ 
              borderRadius: 2, textAlign: "center", p: 2, cursor: "pointer", 
              bgcolor: activeTab === "video" ? "action.selected" : "background.paper",
              border: activeTab === "video" ? "1px solid primary.main" : "",
              "&:hover": { bgcolor: "action.hover" } 
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color={activeTab === "video" ? "primary.main" : "text.primary"}>Video</Typography>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 3}}>
          <Card 
            variant="outlined" 
            onClick={() => setActiveTab("log")}
            sx={{ 
              borderRadius: 2, textAlign: "center", p: 2, cursor: "pointer", 
              bgcolor: activeTab === "log" ? "action.selected" : "background.paper",
              border: activeTab === "log" ? "1px solid primary.main" : "",
              "&:hover": { bgcolor: "action.hover" } 
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color={activeTab === "log" ? "primary.main" : "text.primary"}>Execution Log</Typography>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 3}}>
          <Card 
            variant="outlined" 
            onClick={() => setActiveTab("retry")}
            sx={{ 
              borderRadius: 2, textAlign: "center", p: 2, cursor: "pointer", 
              bgcolor: activeTab === "retry" ? "action.selected" : "background.paper",
              border: activeTab === "retry" ? "1px solid primary.main" : "",
              "&:hover": { bgcolor: "action.hover" } 
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color={activeTab === "retry" ? "primary.main" : "text.primary"}>Retry History</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Render Active Tab Content */}
      <Box sx={{ mt: 2 }}>
        {activeTab === "screenshot" && <ScreenshotViewer testCase={testCase} />}
        {activeTab === "video" && <VideoViewer testCase={testCase} />}
        {activeTab === "log" && <ExecutionLog testCase={testCase} />}
        {activeTab === "retry" && <RetryHistory testCase={testCase} />}
      </Box>
    </Box>
  );
}
