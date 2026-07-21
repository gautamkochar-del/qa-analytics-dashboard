import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const res = await fetch(`/api/users/${user.id}/profile`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setProfile(await res.json());
  };

  if (!profile) return <Typography>Loading profile...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
        <Avatar src={profile.avatar} sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
          {profile.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
          <Typography variant="h6" color="text.secondary">{profile.role?.name || "Member"} • {profile.department?.name || "Unassigned Dept"}</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Details</Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Email" secondary={profile.email} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><WorkIcon /></ListItemIcon>
                  <ListItemText primary="Team" secondary={profile.team?.name || "No Team"} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                  <ListItemText primary="Last Login" secondary={profile.lastLogin ? dayjs(profile.lastLogin).format('MMMM D, YYYY h:mm A') : "Never"} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Skills</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(profile.skills ? profile.skills.split(',') : ["Selenium", "Playwright", "Jest", "CI/CD"]).map((skill, index) => (
                  <Chip key={index} label={skill.trim()} color="primary" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Assigned Projects</Typography>
              <Grid container spacing={2}>
                {profile.assignedProjects?.map(project => (
                  <Grid item xs={12} sm={6} key={project.id}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="700">{project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Role: {project.role}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Activity Timeline</Typography>
              <List disablePadding>
                {profile.activityTimeline?.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem disableGutters>
                      <ListItemIcon><AssignmentIcon color="secondary" /></ListItemIcon>
                      <ListItemText primary={activity.action} secondary={dayjs(activity.date).fromNow()} />
                    </ListItem>
                    {index < profile.activityTimeline.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
