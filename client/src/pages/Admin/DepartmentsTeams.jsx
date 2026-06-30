import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent, CardActions, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as adminApi from "../../api/adminApi";
import { useAppSnackbar } from "../../context/SnackbarContext";

export default function DepartmentsTeams() {
  const { showSnackbar } = useAppSnackbar();

  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deptOpen, setDeptOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);

  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  const [teamForm, setTeamForm] = useState({ name: "", description: "", departmentId: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptsData, teamsData] = await Promise.all([
        adminApi.getDepartments(), adminApi.getTeams()
      ]);
      setDepartments(deptsData);
      setTeams(teamsData);
    } catch (err) {
      showSnackbar("Failed to load organizational structure", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveDept = async () => {
    try {
      await adminApi.createDepartment(deptForm);
      showSnackbar("Department created", "success");
      setDeptOpen(false);
      setDeptForm({ name: "", description: "" });
      fetchData();
    } catch (err) {
      showSnackbar("Failed to create department", "error");
    }
  };

  const handleSaveTeam = async () => {
    try {
      await adminApi.createTeam(teamForm);
      showSnackbar("Team created", "success");
      setTeamOpen(false);
      setTeamForm({ name: "", description: "", departmentId: "" });
      fetchData();
    } catch (err) {
      showSnackbar("Failed to create team", "error");
    }
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
              <Typography variant="h5" fontWeight={600}>Departments</Typography>
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setDeptOpen(true)}>Add Dept</Button>
            </Box>
            <Grid container spacing={2}>
              {departments.length === 0 && <Typography sx={{ p: 2 }}>No departments configured.</Typography>}
              {departments.map((dept) => (
                <Grid size={12} key={dept.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{dept.name}</Typography>
                      {dept.description && <Typography variant="body2" color="text.secondary">{dept.description}</Typography>}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">Teams in this department:</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {dept.teams?.map(t => <Chip key={t.id} label={t.name} size="small" />)}
                          {(!dept.teams || dept.teams.length === 0) && <Typography variant="caption">None</Typography>}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
              <Typography variant="h5" fontWeight={600}>Teams</Typography>
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setTeamOpen(true)}>Add Team</Button>
            </Box>
            <Grid container spacing={2}>
              {teams.length === 0 && <Typography sx={{ p: 2 }}>No teams configured.</Typography>}
              {teams.map((team) => (
                <Grid size={12} key={team.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">{team.name}</Typography>
                        <Chip label={team.department?.name} color="primary" variant="outlined" size="small" />
                      </Box>
                      {team.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{team.description}</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Dept Dialog */}
      <Dialog open={deptOpen} onClose={() => setDeptOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth sx={{ mt: 1, mb: 2 }} value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
          <TextField label="Description" fullWidth multiline rows={2} value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeptOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDept} variant="contained" disabled={!deptForm.name}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Team Dialog */}
      <Dialog open={teamOpen} onClose={() => setTeamOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Team</DialogTitle>
        <DialogContent>
          <TextField select label="Parent Department" fullWidth sx={{ mt: 1, mb: 2 }} value={teamForm.departmentId} onChange={(e) => setTeamForm({ ...teamForm, departmentId: e.target.value })}>
            {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
          </TextField>
          <TextField label="Team Name" fullWidth sx={{ mb: 2 }} value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
          <TextField label="Description" fullWidth multiline rows={2} value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTeam} variant="contained" disabled={!teamForm.name || !teamForm.departmentId}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
