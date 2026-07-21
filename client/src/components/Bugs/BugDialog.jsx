import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, } from "@mui/material";
import { useEffect, useState } from "react";
import useProjects from "../../hooks/useProjects";
import api from "../../api/axios";
import * as jiraApi from "../../api/jiraApi";
import { Box, Typography, Chip, CircularProgress, Divider, Link } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

const modulesList = [
  "General", "Homepage", "Search", "Compare", "Car Details", "Dealer", "Finance", "User Auth", "API", ];

export default function BugDialog({
  open, bug, onClose, onSave, }) {
  const { projects } = useProjects();
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "", description: "", severity: "Medium", status: "Open", projectId: "", module: "General", assigneeId: "", });
  
  const [errors, setErrors] = useState({});
  const [jiraDetails, setJiraDetails] = useState(null);
  const [loadingJira, setLoadingJira] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (bug) {
      setForm({
        title: bug.title || "", description: bug.description || "", severity: bug.severity || "Medium", status: bug.status || "Open", projectId: bug.projectId || "", module: bug.module || "General", assigneeId: bug.assigneeId || "", });
      if (bug.jiraIssueKey) {
        setLoadingJira(true);
        jiraApi.getIssueDetails(bug.id)
          .then(data => setJiraDetails(data))
          .catch(err => console.error("Failed to fetch Jira details", err))
          .finally(() => setLoadingJira(false));
      } else {
        setJiraDetails(null);
      }
    } else {
      setForm({
        title: "", description: "", severity: "Medium", status: "Open", projectId: "", module: "General", assigneeId: "", });
      setJiraDetails(null);
    }
  }, [bug, open]);

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: e.target.value, });

    setErrors({
      ...errors, [e.target.name]: "", });
  };
  
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!form.severity) {
      newErrors.severity = "Severity is required";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      ...form, projectId: Number(form.projectId), assigneeId: form.assigneeId ? Number(form.assigneeId) : null, });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{bug ? "Edit Bug" : "New Bug"}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Project"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              error={!!errors.projectId}
              helperText={errors.projectId}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Module"
              name="module"
              value={form.module}
              onChange={handleChange}
            >
              {modulesList.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Severity"
              name="severity"
              value={form.severity}
              onChange={handleChange}
              error={!!errors.severity}
              helperText={errors.severity}
            >
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              error={!!errors.status}
              helperText={errors.status}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Assignee"
              name="assigneeId"
              value={form.assigneeId}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {bug?.jiraIssueKey && (
            <Grid size={12} sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Live Jira Details ({bug.jiraIssueKey})
              </Typography>
              {loadingJira ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} /> <Typography variant="body2">Loading from Jira...</Typography>
                </Box>
              ) : jiraDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Typography variant="body2" fontWeight={600}>{jiraDetails.status}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Assignee:</Typography>
                    <Typography variant="body2" fontWeight={600}>{jiraDetails.assignee}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Priority:</Typography>
                    <Typography variant="body2" fontWeight={600}>{jiraDetails.priority}</Typography>
                  </Box>
                  {jiraDetails.labels?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {jiraDetails.labels.map(l => (
                        <Chip key={l} label={l} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Link href={jiraDetails.url} target="_blank" underline="hover" variant="body2">
                      Open in Jira
                    </Link>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<SyncIcon />}>Sync</Button>
                    <Button variant="contained" size="small" color="primary">Transition Status</Button>
                    <Button variant="outlined" size="small" color="error">Close Issue</Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="error">Failed to load Jira details.</Typography>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
