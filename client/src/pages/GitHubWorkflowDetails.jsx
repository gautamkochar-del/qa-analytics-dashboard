import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress, Alert, Button, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DownloadIcon from "@mui/icons-material/Download";
import * as githubActionsApi from "../api/githubActionsApi";
import { useAppSnackbar } from "../context/SnackbarContext";
import LiveLogViewer from "../components/GitHub/LiveLogViewer";

export default function GitHubWorkflowDetails() {
  const { owner, repo, runId } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSnackbar } = useAppSnackbar();

  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rerunDialogOpen, setRerunDialogOpen] = useState(false);

  useEffect(() => {
    fetchRunDetails();
  }, [owner, repo, runId]);

  const fetchRunDetails = async () => {
    setLoading(true);
    try {
      const runData = await githubActionsApi.getRun(owner, repo, runId);
      setRun(runData);

      const jobsData = await githubActionsApi.getRunJobs(owner, repo, runId);
      setJobs(jobsData.jobs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch workflow run details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLogs = async () => {
    try {
      const blob = await githubActionsApi.getRunLogs(owner, repo, runId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `logs-${runId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showSnackbar("Failed to download logs. Logs might have expired.", "error");
    }
  };

  const confirmRerun = async () => {
    setRerunDialogOpen(false);
    try {
      await githubActionsApi.rerunWorkflow(owner, repo, runId);
      showSnackbar("Workflow rerun initiated", "success");
      setTimeout(fetchRunDetails, 2000);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to rerun workflow", "error");
    }
  };

  const handleCancel = async () => {
    try {
      await githubActionsApi.cancelWorkflow(owner, repo, runId);
      showSnackbar("Workflow cancellation initiated", "info");
      setTimeout(fetchRunDetails, 2000);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to cancel workflow", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !run) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/github-actions")} sx={{ mb: 2 }}>
          Back to Actions
        </Button>
        <Alert severity="error">{error || "Run not found."}</Alert>
      </Box>
    );
  }

  const isCompleted = ["success", "failure", "cancelled", "skipped"].includes(run.conclusion);
  const startTime = new Date(run.run_started_at || run.created_at);
  const endTime = isCompleted ? new Date(run.updated_at) : new Date();
  const durationSecs = Math.floor((endTime - startTime) / 1000);
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;
  const durationStr = `${mins}m ${secs}s`;

  let statusLabel = "";
  let chipColor = "default";

  if (run.conclusion === "success") {
    statusLabel = "Success"; chipColor = "success";
  } else if (run.conclusion === "failure" || run.conclusion === "timed_out") {
    statusLabel = "Failed"; chipColor = "error";
  } else if (run.conclusion === "cancelled") {
    statusLabel = "Cancelled"; chipColor = "default";
  } else if (run.status === "in_progress") {
    statusLabel = "Running"; chipColor = "primary";
  } else {
    statusLabel = "Queued"; chipColor = "warning";
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/github-actions")} sx={{ mb: 1 }}>
            Back to Actions
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
            {run.name}
            <Chip label={statusLabel} color={chipColor} />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {run.display_title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadLogs}>
            Logs
          </Button>
          {run.status === "in_progress" || run.status === "queued" || run.status === "waiting" ? (
            <Button variant="contained" color="error" startIcon={<StopIcon />} onClick={handleCancel}>
              Cancel Run
            </Button>
          ) : (
            <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />} onClick={() => setRerunDialogOpen(true)}>
              Re-run
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Repository</Typography>
              <Typography variant="body1" fontWeight={500}>{owner}/{repo}</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Branch</Typography>
              <Chip size="small" label={run.head_branch} variant="outlined" sx={{ mt: 0.5 }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Commit SHA</Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                <a href={run.head_commit?.url || run.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#3b82f6' }}>
                  {run.head_sha?.substring(0, 7)}
                </a>
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Commit Message</Typography>
              <Typography variant="body1">{run.head_commit?.message || run.display_title || "-"}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Triggered By</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                {run.actor?.avatar_url && (
                  <img src={run.actor.avatar_url} alt="actor" style={{ width: 24, height: 24, borderRadius: "50%" }} />
                )}
                <Typography variant="body1" fontWeight={500}>{run.actor?.login}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Event Type</Typography>
              <Chip size="small" label={run.event} sx={{ mt: 0.5, textTransform: "capitalize" }} />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Started</Typography>
              <Typography variant="body1">{startTime.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Finished</Typography>
              <Typography variant="body1">{isCompleted ? endTime.toLocaleString() : "-"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Total Duration</Typography>
              <Typography variant="body1">{durationStr}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {jobs.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Job Timeline
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", pb: 5 }}>
            {jobs.map((job, index) => {
              const jCompleted = ["success", "failure", "cancelled", "skipped"].includes(job.conclusion);
              const jStart = new Date(job.started_at);
              const jEnd = jCompleted ? new Date(job.completed_at) : new Date();
              const jDuration = Math.max(0, Math.floor((jEnd - jStart) / 1000));
              const jMins = Math.floor(jDuration / 60);
              const jSecs = jDuration % 60;

              let jColor = "default";
              let jIcon = "⚪";
              if (job.conclusion === "success") { jColor = "success"; jIcon = "🟢"; }
              else if (job.conclusion === "failure") { jColor = "error"; jIcon = "🔴"; }
              else if (job.conclusion === "cancelled") { jColor = "default"; jIcon = "⚫"; }
              else if (job.status === "in_progress") { jColor = "primary"; jIcon = "🟡"; }
              else if (job.status === "queued") { jColor = "warning"; jIcon = "⚪"; }

              return (
                <Box key={job.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  <Paper sx={{ p: 2, borderRadius: 2, width: "100%", maxWidth: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {jIcon} {job.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Status: <span style={{ textTransform: "capitalize" }}>{job.conclusion || job.status}</span>
                        {" • "} Duration: {jMins}m {jSecs}s
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        setSelectedJob(job);
                        setLogViewerOpen(true);
                      }}
                    >
                      View Logs
                    </Button>
                  </Paper>
                  {index < jobs.length - 1 && (
                    <Box sx={{ my: 1, color: "text.secondary", fontSize: 24 }}>
                      ↓
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {selectedJob && (
        <LiveLogViewer
          open={logViewerOpen}
          onClose={() => setLogViewerOpen(false)}
          owner={owner}
          repo={repo}
          jobId={selectedJob.id}
          jobName={selectedJob.name}
          jobStatus={selectedJob.status}
        />
      )}

      <Dialog
        open={rerunDialogOpen}
        onClose={() => setRerunDialogOpen(false)}
      >
        <DialogTitle>Rerun Workflow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to rerun this workflow? This will trigger a new execution on GitHub.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRerunDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRerun} variant="contained" color="primary" autoFocus>
            Rerun
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
