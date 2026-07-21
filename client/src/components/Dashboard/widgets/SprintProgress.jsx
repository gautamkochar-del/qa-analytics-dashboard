import React from 'react';
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from '@mui/material';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';

export default function SprintProgressWidget() {
  const sprintTarget = 1200;
  const sprintExecuted = 843;
  const progressPercent = Math.round((sprintExecuted / sprintTarget) * 100);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <FlagCircleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sprint 18 Progress
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Overall Completion</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{progressPercent}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercent} 
            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(37, 99, 235, 0.1)' }}
          />
        </Box>

        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Executed Tests
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{sprintExecuted} / {sprintTarget}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Remaining Days
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>5</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Open Bugs
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>18</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
