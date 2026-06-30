import prisma from "../config/prisma.js";
import * as emailService from "../services/emailService.js";
import * as jiraService from "../services/jiraService.js";

export const getBugs = async (req, res) => {
  try {
    const {
      projectId,
      severity,
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const where = {};

    if (projectId) {
      where.projectId = Number(projectId);
    }

    if (severity && severity !== "") {
      where.severity = severity;
    }

    if (status && status !== "") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    // Validate sortBy
    const validFields = ["id", "title", "severity", "status", "module", "createdAt"];
    const orderByField = validFields.includes(sortBy) ? sortBy : "createdAt";
    const orderDirection = ["asc", "desc"].includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "desc";

    const [data, total] = await Promise.all([
      prisma.bug.findMany({
        where,
        include: {
          project: true,
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          [orderByField]: orderDirection,
        },
        skip,
        take: limitNum,
      }),
      prisma.bug.count({ where }),
    ]);

    res.json({
      data,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch bugs",
    });
  }
};

export const createBug = async (req, res) => {
  try {
    const { title, description, severity, status, module, projectId, assigneeId } = req.body;

    if (!title || !severity || !status || !projectId) {
      return res.status(400).json({ message: "Please provide title, severity, status and projectId" });
    }

    const bug = await prisma.bug.create({
      data: {
        title,
        description,
        severity,
        status,
        module: module || "General",
        projectId: Number(projectId),
        assigneeId: assigneeId ? Number(assigneeId) : null,
      },
      include: {
        project: true,
        assignee: true,
      },
    });

    req.app.get("io").emit("dashboardUpdate", { type: "bug", action: "create" });

    // Notifications
    if (bug.severity === "Critical") {
      emailService.sendCriticalBugFoundEmail(bug).catch(console.error);
    }
    if (bug.assignee && bug.assignee.email) {
      emailService.sendBugAssignedEmail(bug, bug.assignee.email).catch(console.error);
    }

    // Jira Sync
    jiraService.syncCreateBug(bug).catch(console.error);

    res.status(201).json(bug);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create bug",
    });
  }
};

export const updateBug = async (req, res) => {
  try {
    const { title, description, severity, status, module, projectId, assigneeId } = req.body;

    const bug = await prisma.bug.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title,
        description,
        severity,
        status,
        module,
        projectId: projectId ? Number(projectId) : undefined,
        assigneeId: assigneeId !== undefined ? (assigneeId ? Number(assigneeId) : null) : undefined,
      },
      include: {
        project: true,
        assignee: true,
      },
    });

    req.app.get("io").emit("dashboardUpdate", { type: "bug", action: "update" });

    // Notifications
    if (bug.severity === "Critical" && req.body.severity === "Critical") {
      // Trigger critical bug notification if it just changed to Critical, or just always for simplicity
      emailService.sendCriticalBugFoundEmail(bug).catch(console.error);
    }
    if (bug.assignee && bug.assignee.email && req.body.assigneeId !== undefined) {
      emailService.sendBugAssignedEmail(bug, bug.assignee.email).catch(console.error);
    }

    // Jira Sync
    jiraService.syncUpdateBug(bug).catch(console.error);

    res.json(bug);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update bug",
    });
  }
};

export const deleteBug = async (req, res) => {
  try {
    await prisma.bug.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    req.app.get("io").emit("dashboardUpdate", { type: "bug", action: "delete" });

    res.json({
      message: "Bug deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete bug",
    });
  }
};
