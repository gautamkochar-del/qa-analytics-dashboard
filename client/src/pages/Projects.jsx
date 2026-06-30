import { useState, useEffect } from "react";
import {
  Typography, Alert, Box, Button, IconButton, Paper, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import useProjects from "../hooks/useProjects";
import ProjectTable from "../components/Projects/ProjectTable";
import ProjectDialog from "../components/Projects/ProjectDialog";
import DeleteDialog from "../components/Common/DeleteDialog";
import SkeletonTable from "../components/Common/SkeletonTable";
import * as projectApi from "../api/projectApi";
import { useAppSnackbar } from "../context/SnackbarContext";
import { useSocket } from "../context/SocketContext";

export default function Projects() {
  const {
    projects, loading, error, refreshProjects, } = useProjects();

  const { showSnackbar } = useAppSnackbar();

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (data?.type === "project") refreshProjects();
    };
    socket.on("dashboardUpdate", handleUpdate);
    return () => socket.off("dashboardUpdate", handleUpdate);
  }, [socket, refreshProjects]);

  const handleNew = () => {
    setSelectedProject(null);
    setOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedProject) {
        await projectApi.updateProject(selectedProject.id, data);
        showSnackbar("Project updated successfully", "success");
      } else {
        await projectApi.createProject(data);
        showSnackbar("Project created successfully", "success");
      }

      setOpen(false);
      setSelectedProject(null);
      await refreshProjects();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save project", "error");
    }
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await projectApi.deleteProject(projectToDelete.id);
      setDeleteOpen(false);
      setProjectToDelete(null);
      showSnackbar("Project deleted successfully", "success");
      await refreshProjects();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete project", "error");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Projects
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={refreshProjects} title="Refresh Data">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{ borderRadius: 2 }}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : (
          <ProjectTable
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
      )}

      <ProjectDialog
        open={open}
        project={selectedProject}
        onClose={() => {
          setOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSave}
      />

      <DeleteDialog
        open={deleteOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name || ''}"? This will also delete all associated test runs and bug reports.`}
        onClose={() => {
          setDeleteOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
