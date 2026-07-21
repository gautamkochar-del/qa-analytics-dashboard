import { useState, useCallback, useEffect } from "react";
import {
  Box, Button, Typography, Alert, IconButton, Paper, TablePagination, Grid, MenuItem, TextField, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import useTestRuns from "../hooks/useTestRuns";
import useProjects from "../hooks/useProjects";
import * as testRunApi from "../api/testRunApi";

import TestRunTable from "../components/TestRuns/TestRunTable";
import TestRunDialog from "../components/TestRuns/TestRunDialog";
import ImportDialog from "../components/TestRuns/ImportDialog";
import SearchBar from "../components/Common/SearchBar";
import SkeletonTable from "../components/Common/SkeletonTable";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import DeleteDialog from "../components/Common/DeleteDialog";
import { useAppSnackbar } from "../context/SnackbarContext";
import { useSocket } from "../context/SocketContext";

export default function TestRuns() {
  const {
    testRuns, total, loading, error, page, limit, projectId, status, environment, search, sortBy, sortOrder, setPage, setLimit, setProjectId, setStatus, setEnvironment, setSearch, setSortBy, setSortOrder, refreshTestRuns, } = useTestRuns();

  const { projects } = useProjects();
  const { showSnackbar } = useAppSnackbar();

  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [runToDelete, setRunToDelete] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (data?.type === "testRun") refreshTestRuns();
    };
    socket.on("dashboardUpdate", handleUpdate);
    return () => socket.off("dashboardUpdate", handleUpdate);
  }, [socket, refreshTestRuns]);

  const handleNew = () => {
    setSelectedRun(null);
    setOpen(true);
  };

  const handleEdit = useCallback((run) => {
    setSelectedRun(run);
    setOpen(true);
  }, []);

  const handleSave = async (data) => {
    try {
      if (selectedRun) {
        await testRunApi.updateTestRun(selectedRun.id, data);
        showSnackbar("Test run updated successfully", "success");
      } else {
        await testRunApi.createTestRun(data);
        showSnackbar("Test run created successfully", "success");
      }

      setOpen(false);
      setSelectedRun(null);
      refreshTestRuns();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save test run", "error");
    }
  };

  const handleDelete = useCallback((run) => {
    setRunToDelete(run);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await testRunApi.deleteTestRun(runToDelete.id);
      setDeleteOpen(false);
      setRunToDelete(null);
      refreshTestRuns();
      showSnackbar("Test run deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete test run", "error");
    }
  }, [runToDelete, refreshTestRuns, showSnackbar]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // MUI is 0-indexed, our hook/API is 1-indexed
  };

  const handleRowsPerPageChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSort = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, [setSortBy, setSortOrder]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Test Suite Runs
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={refreshTestRuns} title="Refresh Data">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => setImportOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Import Report
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{ borderRadius: 2 }}
          >
            New Test Run
          </Button>
        </Box>
      </Box>

      {/* Filters and Search Bar */}
      <Paper
  sx={{
    width: "100%",
    overflow: "hidden",
    borderRadius: 3,
  }}
>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{xs: 12, sm: 3}}>
            <SearchBar
              fullWidth
              placeholder="Search suite or project..."
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
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Environment"
              value={environment}
              onChange={(e) => {
                setEnvironment(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All Environments</MenuItem>
              <MenuItem value="QA">QA</MenuItem>
              <MenuItem value="Staging">Staging</MenuItem>
              <MenuItem value="Production">Production</MenuItem>
              <MenuItem value="Dev">Dev</MenuItem>
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
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="passed">Passed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="running">Running</MenuItem>
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
  <SkeletonTable rows={limit} cols={10} />
) : (
  <Paper
    sx={{
      width: "100%",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <TestRunTable
        testRuns={testRuns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </Box>

    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onPageChange={handlePageChange}
      rowsPerPage={limit}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  </Paper>
)}

      <TestRunDialog
        open={open}
        testRun={selectedRun}
        onClose={() => {
          setOpen(false);
          setSelectedRun(null);
        }}
        onSave={handleSave}
      />

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImportSuccess={() => {
          refreshTestRuns();
          showSnackbar("Results imported successfully", "success");
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        title="Delete Test Run"
        message="Are you sure you want to delete this test run? This action cannot be undone."
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
