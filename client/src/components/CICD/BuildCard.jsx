import { Box, Card, CardContent, Typography, Chip, Button, IconButton, Tooltip, Divider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export default function BuildCard({ job, latestBuild, onTrigger, onViewLog }) {
  if (!job) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": return "success";
      case "FAILURE": return "error";
      case "IN_PROGRESS": return "info";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS": return <CheckCircleIcon fontSize="small" />;
      case "FAILURE": return <ErrorIcon fontSize="small" />;
      case "IN_PROGRESS": return <AutorenewIcon fontSize="small" sx={{ animation: "spin 2s linear infinite" }} />;
      default: return null;
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              {job.name}
              <Tooltip title="Open in Jenkins">
                <IconButton size="small" color="primary" onClick={() => window.open(job.url, "_blank")}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latest Build: {latestBuild ? `#${latestBuild.number}` : "No builds found"}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<PlayArrowIcon />} 
            onClick={() => onTrigger(job.name)}
            sx={{ borderRadius: 2 }}
          >
            Trigger Build
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {latestBuild && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
              <Chip 
                label={latestBuild.status || "UNKNOWN"} 
                color={getStatusColor(latestBuild.status)} 
                icon={getStatusIcon(latestBuild.status)}
                size="small" 
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                {latestBuild.duration ? `${(latestBuild.duration / 1000).toFixed(1)}s` : "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Triggered At</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                {new Date(latestBuild.timestamp).toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ ml: "auto" }}>
              <Button 
                variant="outlined" 
                startIcon={<ReceiptLongIcon />} 
                onClick={() => onViewLog(job.name, latestBuild.number)}
                size="small"
              >
                View Console Log
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
