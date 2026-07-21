import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Chip, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';

const columns = [
  { id: 'todo', title: 'To Do', color: '#64748b' },
  { id: 'inprogress', title: 'In Progress', color: '#3b82f6' },
  { id: 'testing', title: 'Testing', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#10b981' }
];

export default function SprintBoard() {
  const [sprintData, setSprintData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await axios.get('/api/sprints', config);
        setSprintData(data);
      } catch (error) {
        console.error('Error fetching sprints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Sprint 19</Typography>
          <Typography variant="subtitle1" color="text.secondary">July 15 - July 29 • 5 Days Remaining</Typography>
        </Box>
        <Chip label="Active Sprint" color="primary" variant="outlined" />
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1, alignItems: 'stretch' }}>
        {columns.map(col => (
          <Grid item xs={12} sm={6} md={3} key={col.id} sx={{ display: 'flex' }}>
            <Paper sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: col.color }} />
                  <Typography variant="subtitle1" fontWeight={700}>{col.title}</Typography>
                </Box>
                <Chip size="small" label={loading ? '...' : (sprintData[col.id]?.length || 0)} sx={{ fontWeight: 700 }} />
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                  {(sprintData[col.id] || []).map(task => (
                    <Card key={task.id} sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' } }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" fontWeight={600} mb={1}>{task.title}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Chip size="small" label={task.type} variant="outlined" />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{task.id}</Typography>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>{task.assignee}</Avatar>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {!loading && (sprintData[col.id] || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                      No tasks.
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
