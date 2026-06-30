import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, } from "@mui/material";
import { useEffect, useState } from "react";
import useProjects from "../../hooks/useProjects";
import api from "../../api/axios";

const modulesList = [
  "General", "Homepage", "Search", "Compare", "Car Details", "Dealer", "Finance", "User Auth", "API", ];

export default function BugDialog({
  open, bug, onClose, onSave, }) {
  const { projects } = useProjects();
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "", description: "", severity: "Medium", status: "Open", projectId: "", module: "General", assigneeId: "", });
  
  const [errors, setErrors] = useState({});

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
    } else {
      setForm({
        title: "", description: "", severity: "Medium", status: "Open", projectId: "", module: "General", assigneeId: "", });
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
