import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

// @desc    Get all users (detailed for Admin)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true,
        team: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // Remove passwords before sending
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
  }
};

// @desc    Create new user
// @route   POST /api/users
export const createUser = async (req, res) => {
  const { name, email, password, roleId, departmentId, teamId } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: roleId ? Number(roleId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        teamId: teamId ? Number(teamId) : null,
      },
      include: { role: true, department: true, team: true }
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { name, email, roleId, departmentId, teamId } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        email,
        roleId: roleId ? Number(roleId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        teamId: teamId ? Number(teamId) : null,
        avatar: req.body.avatar !== undefined ? req.body.avatar : undefined,
        skills: req.body.skills !== undefined ? req.body.skills : undefined,
      },
      include: { role: true, department: true, team: true }
    });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// @desc    Toggle user active status (Disable/Enable)
// @route   PATCH /api/users/:id/disable
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });

    res.json({ message: `User ${updated.isActive ? "enabled" : "disabled"}`, isActive: updated.isActive });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle user status" });
  }
};

// @desc    Admin reset user password
// @route   PATCH /api/users/:id/reset-password
export const resetUserPassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { password: hashedPassword },
    });
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// @desc    Get User Profile
// @route   GET /api/users/:id/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        role: true,
        department: true,
        team: true,
        assignedBugs: {
          include: { project: true }
        }
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Mocking Assigned Projects and Activity Timeline since they require complex queries
    const profile = {
      ...user,
      assignedProjects: [
        { id: 1, name: "QA Dashboard", role: "Lead" },
        { id: 2, name: "Mobile App Automation", role: "Contributor" }
      ],
      activityTimeline: [
        { id: 1, action: "Resolved Bug #482", date: new Date().toISOString() },
        { id: 2, action: "Triggered Jenkins Build", date: new Date(Date.now() - 86400000).toISOString() },
      ]
    };

    const { password, ...safeProfile } = profile;
    res.json(safeProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load user profile" });
  }
};
