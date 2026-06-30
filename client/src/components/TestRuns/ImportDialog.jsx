import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Typography, } from "@mui/material";
import useProjects from "../../hooks/useProjects";
import api from "../../api/axios";

export default function ImportDialog({ open, onClose, onImportSuccess }) {
  const { projects } = useProjects();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    projectId: "", environment: "QA", format: "playwright", });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.projectId || !file) {
      setError("Project and File are required");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("projectId", form.projectId);
    formData.append("environment", form.environment);
    formData.append("file", file);

    try {
      await api.post(`/import/${form.format}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, });
      onImportSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Import Test Results</DialogTitle>
      <DialogContent>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Project"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              select
              fullWidth
              label="Environment"
              name="environment"
              value={form.environment}
              onChange={handleChange}
            >
              <MenuItem value="QA">QA</MenuItem>
              <MenuItem value="Staging">Staging</MenuItem>
              <MenuItem value="Production">Production</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Report Format"
              name="format"
              value={form.format}
              onChange={handleChange}
            >
              <MenuItem value="playwright">Playwright JSON</MenuItem>
              <MenuItem value="cypress">Cypress JSON</MenuItem>
              <MenuItem value="junit">JUnit XML</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <input
              type="file"
              accept=".json,.xml"
              onChange={handleFileChange}
              style={{ width: "100%", padding: "10px 0" }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !file || !form.projectId}>
          {loading ? "Importing..." : "Upload & Parse"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
