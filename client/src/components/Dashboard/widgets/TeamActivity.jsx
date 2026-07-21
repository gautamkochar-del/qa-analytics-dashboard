import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BugReportIcon from '@mui/icons-material/BugReport';
import CommitIcon from '@mui/icons-material/Commit';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

export default function TeamActivityWidget() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <GroupsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Today's Activity
          </Typography>
        </Box>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayArrowIcon fontSize="small" /> Executed Tests
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>1264</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugReportIcon fontSize="small" /> Resolved Bugs
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>14</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommitIcon fontSize="small" /> Commits
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>32</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudDoneIcon fontSize="small" /> Deployments
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>5</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
