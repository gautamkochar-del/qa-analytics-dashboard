import { Card, CardContent, Typography, Box, LinearProgress, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function PipelineStatus({ builds }) {
  const theme = useTheme();

  if (!builds || builds.length === 0) return null;

  const total = builds.length;
  const successCount = builds.filter(b => b.status === "SUCCESS").length;
  const failureCount = builds.filter(b => b.status === "FAILURE").length;
  
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Pipeline Health
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Success Rate</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: successRate > 80 ? 'success.main' : 'error.main' }}>
            {successRate}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={successRate} 
          color={successRate > 80 ? "success" : "error"}
          sx={{ height: 8, borderRadius: 4, mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{successCount}</Typography>
              <Typography variant="caption" color="text.secondary">Successful</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ErrorIcon color="error" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{failureCount}</Typography>
              <Typography variant="caption" color="text.secondary">Failed</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
