import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const insights = [
  { id: 1, text: "Pass Rate improved by 3%", type: 'positive' },
  { id: 2, text: "Regression Suite has failed 3 consecutive runs", type: 'negative' },
  { id: 3, text: "Open Bugs reduced by 18%", type: 'positive' },
  { id: 4, text: "Automation Coverage increased", type: 'positive' },
];

export default function AIInsightsWidget() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%', background: 'linear-gradient(135deg, rgba(238,235,255,1) 0%, rgba(255,255,255,1) 100%)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#7C3AED', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5B21B6' }}>
            AI Insights
          </Typography>
        </Box>
        <List disablePadding>
          {insights.map((insight) => (
            <ListItem key={insight.id} disableGutters sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {insight.type === 'positive' && insight.text.includes('reduced') ? (
                  <TrendingDownIcon color="success" />
                ) : insight.type === 'positive' ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <ErrorOutlineIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={insight.text} 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
