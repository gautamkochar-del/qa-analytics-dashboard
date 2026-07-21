import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0px 10px 30px rgba(37, 117, 252, 0.3)',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Good Morning, Gautam 👋
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem' }}>
          Here's your QA overview for today.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 6 }} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>3</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.5px' }}>RUNNING TEST SUITES</Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>2</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.5px' }}>CRITICAL BUGS</Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Successful</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.5px' }}>LATEST BUILD</Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/tests')}
            startIcon={<PlayArrowIcon />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
              boxShadow: 'none',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1,
            }}
          >
            New Test Run
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/bugs')}
            startIcon={<BugReportIcon />}
            sx={{
              bgcolor: 'white',
              color: '#6a11cb',
              '&:hover': { bgcolor: '#f5f5f5' },
              boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1,
            }}
          >
            Report Bug
          </Button>
        </Stack>
      </Box>
      
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -50,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          right: 200,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 1,
        }}
      />
    </Paper>
  );
}
