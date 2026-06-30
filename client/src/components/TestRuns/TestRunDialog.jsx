import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, } from "@mui/material";
import * as projectApi from "../../api/projectApi";

export default function TestRunDialog({
  open, onClose, onSave, testRun, }) {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    projectId: "", suiteName: "Default Suite", environment: "QA", status: "passed", total: "", passed: "", failed: "", skipped: "0", duration: "", // runtime in seconds
    executionDate: new Date().toISOString().split("T")[0], });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (open) {
      loadProjects();
    }
  }, [open]);

  useEffect(() => {
    if (testRun) {
      setForm({
        projectId: testRun.projectId || "", suiteName: testRun.suiteName || "Default Suite", environment: testRun.environment || "QA", status: testRun.status || "passed", total: String(testRun.total || ""), passed: String(testRun.passed || ""), failed: String(testRun.failed || ""), skipped: String(testRun.skipped || "0"), duration: String(testRun.duration || ""), executionDate: testRun.executionDate?.split("T")[0] || "", });
    } else {
      setForm({
        projectId: "", suiteName: "Default Suite", environment: "QA", status: "passed", total: "", passed: "", failed: "", skipped: "0", duration: "", executionDate: new Date().toISOString().split("T")[0], });
    }
  }, [testRun, open]);

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: e.target.value, });
  };

  const handleSave = () => {
    const total = Number(form.total);
    const passed = Number(form.passed || 0);
    const failed = Number(form.failed || 0);
    const skipped = Number(form.skipped || 0);

    if (passed + failed + skipped > total) {
      alert("Passed + Failed + Skipped cannot be greater than Total Tests");
      return;
    }

    onSave({
      ...form, projectId: Number(form.projectId), total, passed, failed, skipped, duration: Number(form.duration || 0), });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{testRun ? "Edit Test Run" : "New Test Run"}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Project"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
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
              fullWidth
              label="Suite Name"
              name="suiteName"
              value={form.suiteName}
              onChange={handleChange}
            />
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
              <MenuItem value="Dev">Dev</MenuItem>
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
            >
              <MenuItem value="passed">PASSED</MenuItem>
              <MenuItem value="failed">FAILED</MenuItem>
              <MenuItem value="running">RUNNING</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Duration (seconds)"
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Total Tests"
              name="total"
              type="number"
              value={form.total}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Passed"
              name="passed"
              type="number"
              value={form.passed}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Failed"
              name="failed"
              type="number"
              value={form.failed}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Skipped"
              name="skipped"
              type="number"
              value={form.skipped}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              type="date"
              name="executionDate"
              label="Execution Date"
              value={form.executionDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true, }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!form.projectId || !form.total}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
