import { Box, Paper, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function PipelineTimeline({ failedStage, latestBuildStatus }) {
  const stages = [
    { name: "Checkout SCM", status: "SUCCESS" },
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

  const getIcon = (status) => {
    if (status === "SUCCESS") return <CheckCircleOutlineIcon color="success" />;
    if (status === "FAILURE") return <ErrorOutlineIcon color="error" />;
    return <HourglassEmptyIcon color="disabled" />;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Pipeline Stages
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, height: 400, overflow: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, position: "relative" }}>
          {/* Vertical line connecting the dots */}
          <Box sx={{ position: "absolute", left: 11, top: 20, bottom: 20, width: 2, bgcolor: "divider", zIndex: 0 }} />
          
          {stages.map((stage, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2, zIndex: 1, position: "relative" }}>
              <Box sx={{ bgcolor: "background.paper", borderRadius: "50%" }}>
                {getIcon(stage.status)}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getColor(stage.status) }}>
                  {stage.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {stage.status || "PENDING"}
                </Typography>
                {failedStage && failedStage.name === stage.name && failedStage.error && (
                  <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>
                    {failedStage.error.message || "Stage failed."}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
