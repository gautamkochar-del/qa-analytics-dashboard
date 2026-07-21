import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BugReportIcon from '@mui/icons-material/BugReport';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "New Test Run", icon: <PlayArrowIcon />, color: "primary", path: "/tests" },
    { label: "Create Bug", icon: <BugReportIcon />, color: "error", path: "/bugs" },
    { label: "Import XML", icon: <FileUploadIcon />, color: "secondary", path: "/reports" },
    { label: "Export PDF", icon: <DownloadIcon />, color: "info", path: "/reports" },
    { label: "Connect GitHub", icon: <GitHubIcon />, color: "inherit", path: "/github", sx: { bgcolor: '#24292e', color: 'white', '&:hover': { bgcolor: '#1b1f23' }, borderColor: '#24292e' } },
    { label: "Connect Jenkins", icon: <SettingsInputComponentIcon />, color: "warning", path: "/cicd" },
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <FlashOnIcon sx={{ color: '#fbc02d', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Quick Actions
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid size={{xs: 12, sm: 6}} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(action.path)}
                color={action.color !== 'inherit' ? action.color : undefined}
                startIcon={action.icon}
                sx={{ 
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  ...(action.sx || {})
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {action.label}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
