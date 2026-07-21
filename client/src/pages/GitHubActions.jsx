import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import * as githubActionsApi from "../api/githubActionsApi";
import { useAppSnackbar } from "../context/SnackbarContext";

export default function GitHubActions() {
  const [owner, setOwner] = useState(localStorage.getItem("gh_owner") || "");
  const [repo, setRepo] = useState(localStorage.getItem("gh_repo") || "");
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState(null);
  const { showSnackbar } = useAppSnackbar();
  const navigate = useNavigate();

  const [cancelDialog, setCancelDialog] = useState({ open: false, runId: null });
  const [rerunDialog, setRerunDialog] = useState({ open: false, runId: null });

  const [stats, setStats] = useState({
    running: 0,
    queued: 0,
    successful: 0,
    failed: 0,
    cancelled: 0,
  });

  const selectedWorkflowRef = useRef(null);

  useEffect(() => {
    selectedWorkflowRef.current = selectedWorkflow;
  }, [selectedWorkflow]);

  useEffect(() => {
    if (owner && repo) {
      fetchData();
      const interval = setInterval(() => {
        fetchData(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [owner, repo]);

  const fetchData = async (isBackground = false) => {
    if (!owner || !repo) return;
    if (!isBackground) setLoading(true);
    if (!isBackground) setError(null);
    try {
      localStorage.setItem("gh_owner", owner);
      localStorage.setItem("gh_repo", repo);
      
      const wfData = await githubActionsApi.getWorkflows(owner, repo);
      const wfs = wfData.workflows || [];
      setWorkflows(wfs);
      
      if (wfs.length > 0) {
        // Fetch runs for the first workflow by default or currently selected
        const wfToFetch = selectedWorkflowRef.current || wfs[0].id;
        if (!selectedWorkflowRef.current) setSelectedWorkflow(wfToFetch);
        await fetchRuns(wfToFetch);
      }
    } catch (err) {
      console.error(err);
      if (!isBackground) setError(err.response?.data?.message || err.message || "Failed to load GitHub Actions data.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const fetchRuns = async (workflowId) => {
    try {
      const runsData = await githubActionsApi.getWorkflowRuns(owner, repo, workflowId);
      const fetchedRuns = runsData.workflow_runs || [];
      setRuns(fetchedRuns);
      
      // Calculate stats for these runs
      let running = 0, queued = 0, successful = 0, failed = 0, cancelled = 0;
      fetchedRuns.forEach(r => {
        if (r.status === "in_progress") running++;
        else if (r.status === "queued" || r.status === "waiting") queued++;
        else if (r.conclusion === "success") successful++;
        else if (r.conclusion === "failure") failed++;
        else if (r.conclusion === "cancelled") cancelled++;
      });
      setStats({ running, queued, successful, failed, cancelled });
    } catch (err) {
      console.error("Failed to fetch runs", err);
      showSnackbar("Failed to fetch workflow runs", "error");
    }
  };

  const handleRerunClick = (e, runId) => {
    e.stopPropagation();
    setRerunDialog({ open: true, runId });
  };

  const confirmRerun = async () => {
    const { runId } = rerunDialog;
    setRerunDialog({ open: false, runId: null });
    if (!runId) return;
    try {
      await githubActionsApi.rerunWorkflow(owner, repo, runId);
      showSnackbar("Workflow rerun initiated", "success");
      setTimeout(() => fetchRuns(selectedWorkflow), 2000);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to rerun workflow", "error");
    }
  };

  const handleCancelClick = (e, runId) => {
    e.stopPropagation();
    setCancelDialog({ open: true, runId });
  };

  const confirmCancel = async () => {
    const { runId } = cancelDialog;
    setCancelDialog({ open: false, runId: null });
    if (!runId) return;
    try {
      await githubActionsApi.cancelWorkflow(owner, repo, runId);
      showSnackbar("Workflow cancellation initiated", "info");
      setTimeout(() => fetchRuns(selectedWorkflow), 2000);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to cancel workflow", "error");
    }
  };

  const handleDownloadLogs = async (runId) => {
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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          GitHub Actions
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g., facebook"
          />
          <TextField
            size="small"
            label="Repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g., react"
          />
          <Button variant="contained" onClick={() => fetchData(false)} startIcon={<RefreshIcon />}>
            Load Data
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "info.light", color: "info.contrastText" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PlayCircleOutlineIcon fontSize="large" />
              <Box>
                <Typography variant="h4">{stats.running}</Typography>
                <Typography variant="subtitle2">Running</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AccessTimeIcon fontSize="large" />
              <Box>
                <Typography variant="h4">{stats.queued}</Typography>
                <Typography variant="subtitle2">Queued</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "success.light", color: "success.contrastText" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleOutlineIcon fontSize="large" />
              <Box>
                <Typography variant="h4">{stats.successful}</Typography>
                <Typography variant="subtitle2">Successful</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "error.light", color: "error.contrastText" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ErrorOutlineIcon fontSize="large" />
              <Box>
                <Typography variant="h4">{stats.failed}</Typography>
                <Typography variant="subtitle2">Failed</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: "grey.400", color: "text.primary" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CancelOutlinedIcon fontSize="large" />
              <Box>
                <Typography variant="h4">{stats.cancelled}</Typography>
                <Typography variant="subtitle2">Cancelled</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : workflows.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Workflows</Typography>
              {workflows.map(wf => (
                <Button
                  key={wf.id}
                  fullWidth
                  variant={selectedWorkflow === wf.id ? "contained" : "text"}
                  sx={{ justifyContent: "flex-start", mb: 1, textTransform: "none" }}
                  onClick={() => {
                    setSelectedWorkflow(wf.id);
                    fetchRuns(wf.id);
                  }}
                >
                  {wf.name}
                </Button>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workflow</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Commit</TableCell>
                    <TableCell>Actor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Started</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {runs.map(run => {
                    const isCompleted = ["success", "failure", "cancelled", "skipped"].includes(run.conclusion);
                    const startTime = new Date(run.run_started_at || run.created_at);
                    const endTime = isCompleted ? new Date(run.updated_at) : new Date();
                    const durationSecs = Math.floor((endTime - startTime) / 1000);
                    const mins = Math.floor(durationSecs / 60);
                    const secs = durationSecs % 60;
                    const durationStr = `${mins}m ${secs}s`;

                    let statusLabel = "";
                    let chipColor = "default";
                    let chipIcon = "⚪";

                    if (run.conclusion === "success") {
                      statusLabel = "Success";
                      chipColor = "success";
                      chipIcon = "🟢";
                    } else if (run.conclusion === "failure" || run.conclusion === "timed_out") {
                      statusLabel = "Failed";
                      chipColor = "error";
                      chipIcon = "🔴";
                    } else if (run.conclusion === "cancelled") {
                      statusLabel = "Cancelled";
                      chipColor = "default";
                      chipIcon = "⚫";
                    } else if (run.status === "in_progress") {
                      statusLabel = "Running";
                      chipColor = "primary";
                      chipIcon = "🟡";
                    } else {
                      statusLabel = "Queued";
                      chipColor = "warning";
                      chipIcon = "⚪";
                    }

                    return (
                      <TableRow 
                        key={run.id} 
                        hover
                        onClick={() => navigate(`/github-actions/${owner}/${repo}/runs/${run.id}`)}
                        sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                      >
                        <TableCell>{run.name}</TableCell>
                        <TableCell>
                          <Chip size="small" label={run.head_branch} variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>
                          <a href={run.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }} onClick={(e) => e.stopPropagation()}>
                            {run.head_sha?.substring(0, 7)}
                          </a>
                        </TableCell>
                        <TableCell>{run.actor?.login}</TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label={`${chipIcon} ${statusLabel}`} 
                            color={chipColor}
                            sx={{ fontWeight: 600, pl: 0.5 }}
                          />
                        </TableCell>
                        <TableCell>{durationStr}</TableCell>
                        <TableCell>{startTime.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" title="Download Logs" onClick={(e) => { e.stopPropagation(); handleDownloadLogs(run.id); }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          {run.status === "in_progress" || run.status === "queued" || run.status === "waiting" ? (
                            <IconButton size="small" color="error" title="Cancel Run" onClick={(e) => handleCancelClick(e, run.id)}>
                              <StopIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" color="primary" title="Rerun Workflow" onClick={(e) => handleRerunClick(e, run.id)}>
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {runs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No runs found for this workflow.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, runId: null })}
      >
        <DialogTitle>Cancel Workflow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this workflow? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, runId: null })}>Cancel</Button>
          <Button onClick={confirmCancel} variant="contained" color="error" autoFocus>
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
