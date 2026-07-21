import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Avatar } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CICDWidget() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: '#d32f2f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>J</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Jenkins
          </Typography>
        </Box>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsInputComponentIcon fontSize="small" /> Pipeline
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>#582</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon fontSize="small" color="success" /> Status
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>SUCCESS</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" /> Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>4m 15s</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon fontSize="small" /> Environment
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>QA</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" /> Triggered By
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem', bgcolor: 'primary.main' }}>G</Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Gautam Kochar</Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
