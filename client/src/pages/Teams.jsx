import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, IconButton, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', departmentId: '' });

  useEffect(() => {
    fetchTeams();
    fetchDepartments();
  }, []);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setTeams(await res.json());
  };

  const fetchDepartments = async () => {
    const res = await fetch('/api/teams/departments', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setDepartments(await res.json());
  };

  const handleSave = async () => {
    await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData)
    });
    setOpen(false);
    fetchTeams();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Team Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Create Team</Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map(team => (
          <Grid item xs={12} md={6} lg={4} key={team.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{team.name}</Typography>
                  <Box>
                    <IconButton size="small" color="primary"><EditIcon /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{team.description}</Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip size="small" label={team.department?.name || "Unassigned"} color="secondary" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon color="action" />
                    <Typography variant="body2" fontWeight="600">{team.users?.length || 0} Members</Typography>
                  </Box>
                  <Button size="small" startIcon={<AssessmentIcon />}>Performance</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Team Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} fullWidth />
            <TextField label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} fullWidth multiline rows={3} />
            <TextField select label="Department" value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} fullWidth>
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
