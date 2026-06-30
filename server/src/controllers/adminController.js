import prisma from "../config/prisma.js";

// === ROLES ===
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

export const createRole = async (req, res) => {
  try {
    const role = await prisma.role.create({ data: req.body });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: "Failed to create role" });
  }
};

// === DEPARTMENTS ===
export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({ include: { teams: true } });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const dept = await prisma.department.create({ data: req.body });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: "Failed to create department" });
  }
};

// === TEAMS ===
export const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({ include: { department: true } });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = await prisma.team.create({ 
      data: {
        name: req.body.name,
        description: req.body.description,
        departmentId: Number(req.body.departmentId)
      } 
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team" });
  }
};
