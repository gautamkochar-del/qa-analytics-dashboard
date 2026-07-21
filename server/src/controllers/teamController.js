import prisma from "../config/prisma.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        department: true,
        users: {
          include: {
            role: true
          }
        }
      }
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to load teams" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, description, departmentId } = req.body;
    const team = await prisma.team.create({
      data: { name, description, departmentId }
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { name, description, departmentId } = req.body;
    const team = await prisma.team.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, departmentId }
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    await prisma.team.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to load departments" });
  }
};
