import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const events = [
  { id: 1, time: "Today", title: "Regression Suite" },
  { id: 2, time: "Tomorrow", title: "Sprint Demo" },
  { id: 3, time: "Friday", title: "Release Candidate" },
  { id: 4, time: "Next Week", title: "Sprint Planning" },
];

export default function CalendarWidget() {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <EventIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Upcoming Events
          </Typography>
        </Box>
        <List disablePadding>
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <ListItem disableGutters sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={event.title} 
                  secondary={event.time}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                  secondaryTypographyProps={{ variant: 'caption', fontWeight: 600, color: 'text.secondary' }}
                />
              </ListItem>
              {index < events.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
