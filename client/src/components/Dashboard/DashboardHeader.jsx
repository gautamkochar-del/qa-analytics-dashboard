import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">QA Analytics Dashboard</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Overview
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        {currentDate}
      </Typography>
    </Box>
  );
}
