import * as projectService from "../services/projectService.js";
import * as emailService from "../services/emailService.js";

export const getProjects = async (req, res) => {
  const projects = await projectService.getAllProjects();
  res.json(projects);
};

export const getProject = async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  res.json(project);
};

export const createProject = async (req, res) => {
  const project = await projectService.createProject(req.body);

  // Trigger Notification
  emailService.sendProjectCreatedEmail(project).catch(console.error);
  
  req.app.get("io").emit("dashboardUpdate", { type: "project", action: "create" });

  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.body
  );

  req.app.get("io").emit("dashboardUpdate", { type: "project", action: "update" });

  res.json(project);
};

export const deleteProject = async (req, res) => {
  await projectService.deleteProject(req.params.id);

  req.app.get("io").emit("dashboardUpdate", { type: "project", action: "delete" });

  res.json({
    message: "Project deleted",
  });
};
