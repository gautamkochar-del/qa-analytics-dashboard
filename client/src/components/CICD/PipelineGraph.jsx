import { Box, Paper, Typography, Tooltip } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function PipelineGraph({ failedStage, latestBuildStatus }) {
  const stages = [
    { name: "Checkout", status: "SUCCESS" },
    { name: "Build", status: "SUCCESS" },
    { name: "Test", status: failedStage?.name === "Test" ? "FAILURE" : (failedStage ? "SUCCESS" : latestBuildStatus) },
    { name: "Deploy", status: failedStage ? "PENDING" : latestBuildStatus }
  ];

  if (failedStage && !stages.find(s => s.name === failedStage.name)) {
    const failedIndex = stages.findIndex(s => s.status === "FAILURE" || s.status === "PENDING");
    if (failedIndex > -1) {
      stages.splice(failedIndex, 0, { name: failedStage.name, status: "FAILURE" });
    }
  }

  const getColor = (status) => {
    if (status === "SUCCESS") return "success.main";
    if (status === "FAILURE") return "error.main";
    if (status === "IN_PROGRESS") return "info.main";
    return "text.disabled";
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Execution Flow Graph
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", overflowX: "auto" }}>
        {stages.map((stage, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={`Status: ${stage.status || "PENDING"}`}>
              <Box 
                sx={{ 
                  px: 3, py: 1.5, 
                  borderRadius: 2, 
                  bgcolor: getColor(stage.status),
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  minWidth: 100,
                  textAlign: "center"
                }}
              >
                {stage.name}
              </Box>
            </Tooltip>
            {idx < stages.length - 1 && (
              <Box sx={{ mx: 2, color: "text.secondary", display: "flex", alignItems: "center" }}>
                <ArrowRightAltIcon fontSize="large" />
              </Box>
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
