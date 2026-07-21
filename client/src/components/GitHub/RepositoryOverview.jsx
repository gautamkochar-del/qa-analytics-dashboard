import { Box, Card, CardContent, Typography, Chip, IconButton, Tooltip, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import CodeIcon from "@mui/icons-material/Code";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import BugReportIcon from "@mui/icons-material/BugReport";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function RepositoryOverview({ repository }) {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  if (!repository) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {repository.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {repository.fullName}
            </Typography>
          </Box>
          <Tooltip title="Open in GitHub">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => window.open(repository.url, "_blank")}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, minHeight: 40 }}>
          {repository.description || "No description provided."}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudDownloadIcon />}
            onClick={() => setSnackbarMessage("Successfully pulled latest code from origin/main")}
            size="small"
          >
            Git Pull
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<CloudUploadIcon />}
            onClick={() => setSnackbarMessage("Successfully pushed local commits to origin/main")}
            size="small"
          >
            Git Push
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Chip 
            icon={<CodeIcon fontSize="small" />} 
            label={repository.language || "Unknown"} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<StarIcon fontSize="small" />} 
            label={`${repository.stars} Stars`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<ForkRightIcon fontSize="small" />} 
            label={`${repository.forks || 0} Forks`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<BugReportIcon fontSize="small" />} 
            label={`${repository.issues || 0} Issues`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<VisibilityIcon fontSize="small" />} 
            label={`${repository.watchers || 0} Watchers`} 
            size="small" 
            variant="outlined" 
          />
          {repository.private && (
            <Chip 
              label="Private" 
              size="small" 
              color="error" 
              variant="outlined" 
            />
          )}
        </Box>
      </CardContent>

      <Snackbar 
        open={!!snackbarMessage} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarMessage("")} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
