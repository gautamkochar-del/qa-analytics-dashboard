import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip, Avatar } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CommitIcon from '@mui/icons-material/Commit';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function GithubWidget() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <GitHubIcon sx={{ color: '#24292e', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            GitHub Actions
          </Typography>
        </Box>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon fontSize="small" /> Repository
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>qa-analytics-dashboard</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountTreeIcon fontSize="small" /> Branch
            </Typography>
            <Chip size="small" label="feature/react-migration" sx={{ fontWeight: 600, fontFamily: 'monospace' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommitIcon fontSize="small" /> Latest Commit
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src="https://github.com/github.png" sx={{ width: 20, height: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>"Fix Reports Filter"</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon fontSize="small" /> Workflow
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>CI Build</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon fontSize="small" color="success" /> Status
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>Success</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" /> Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>2m 41s</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
