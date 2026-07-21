import { useState, useCallback, useEffect } from "react";
import {
  Typography, Alert, Button, TextField, MenuItem, Stack, TablePagination, Box, IconButton, Paper, Grid, } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import useBugs from "../hooks/useBugs";
import useProjects from "../hooks/useProjects";
import BugTable from "../components/Bugs/BugTable";
import BugDialog from "../components/Bugs/BugDialog";
import SearchBar from "../components/Common/SearchBar";
import SkeletonTable from "../components/Common/SkeletonTable";
import DeleteDialog from "../components/Common/DeleteDialog";

import * as bugApi from "../api/bugApi";
import * as integrationApi from "../api/integrationApi";
import * as jiraApi from "../api/jiraApi";
import { useAppSnackbar } from "../context/SnackbarContext";
import { useSocket } from "../context/SocketContext";
import SyncIcon from "@mui/icons-material/Sync";

export default function Bugs() {
  const {
    bugs, total, loading, error, page, limit, projectId, severity, status, search, sortBy, sortOrder, setPage, setLimit, setProjectId, setSeverity, setStatus, setSearch, setSortBy, setSortOrder, refreshBugs, } = useBugs();

  const { projects } = useProjects();
  const { showSnackbar } = useAppSnackbar();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);

  const [jiraUrl, setJiraUrl] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await integrationApi.getIntegrations();
        const jiraInt = data.find((i) => i.provider === "Jira" && i.isActive);
        if (jiraInt && jiraInt.url) {
          setJiraUrl(jiraInt.url);
        }
      } catch (err) {
        console.error("Failed to load integrations", err);
      }
    };
    fetchIntegrations();
  }, []);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (data?.type === "bug") refreshBugs();
    };
    socket.on("dashboardUpdate", handleUpdate);
    return () => socket.off("dashboardUpdate", handleUpdate);
  }, [socket, refreshBugs]);

  const handleAdd = () => {
    setSelectedBug(null);
    setOpenDialog(true);
  };

  const handleEdit = useCallback((bug) => {
    setSelectedBug(bug);
    setOpenDialog(true);
  }, []);

  const handleDelete = useCallback((bug) => {
    setBugToDelete(bug);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = async () => {
    try {
      await bugApi.deleteBug(bugToDelete.id);
      setDeleteOpen(false);
      setBugToDelete(null);
      refreshBugs();
      showSnackbar("Bug deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete bug", "error");
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedBug) {
        await bugApi.updateBug(selectedBug.id, data);
        showSnackbar("Bug updated successfully", "success");
      } else {
        await bugApi.createBug(data);
        showSnackbar("Bug logged successfully", "success");
      }

      setOpenDialog(false);
      setSelectedBug(null);
      refreshBugs();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save bug details", "error");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // MUI is 0-indexed, our hook uses 1-indexed
  };

  const handleRowsPerPageChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSort = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, [setSortBy, setSortOrder]);

  const handleJiraSync = async () => {
    try {
      setSyncing(true);
      const res = await jiraApi.syncBugs();
      showSnackbar(res.message, "success");
      refreshBugs();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Failed to sync Jira bugs", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handlePushToJira = async (bug) => {
    try {
      const res = await jiraApi.createIssue(bug.id);
      showSnackbar(res.message, "success");
      refreshBugs();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Failed to push to Jira", "error");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Defects & Bugs
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleJiraSync}
            disabled={!jiraUrl || syncing}
            sx={{ borderRadius: 2 }}
          >
            {syncing ? "Syncing..." : "Sync Jira"}
          </Button>
          <IconButton onClick={refreshBugs} title="Refresh Data">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ borderRadius: 2 }}
          >
            Report Bug
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Panel */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{xs: 12, sm: 3}}>
            <SearchBar
              fullWidth
              placeholder="Search bug title or description..."
              value={search}
              onChange={setSearch}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Project"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Severity"
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Severities</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <SkeletonTable rows={limit} cols={8} />
      ) : (
          <BugTable
            bugs={bugs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPushToJira={handlePushToJira}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            jiraUrl={jiraUrl}
            page={page}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
            onLimitChange={handleRowsPerPageChange}
            loading={loading}
          />
      )}

      <BugDialog
        open={openDialog}
        bug={selectedBug}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      <DeleteDialog
        open={deleteOpen}
        title="Delete Defect Report"
        message="Are you sure you want to delete this bug report? This will permanently delete the record."
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
