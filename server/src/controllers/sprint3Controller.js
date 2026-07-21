import prisma from "../config/prisma.js";

// Departments
export const getDepartments = async (req, res) => {
  const depts = await prisma.department.findMany();
  res.json(depts);
};

// TestCases
export const getTestCases = async (req, res) => {
  const testcases = await prisma.testCase.findMany({ include: { steps: true } });
  res.json(testcases);
};

export const createTestCase = async (req, res) => {
  const { title, expectedResult, priority, automationStatus, folder } = req.body;
  const tc = await prisma.testCase.create({ data: { title, expectedResult, priority, automationStatus, folder } });
  res.status(201).json(tc);
};

// Releases
export const getReleases = async (req, res) => {
  const releases = await prisma.release.findMany();
  res.json(releases);
};

export const createRelease = async (req, res) => {
  const { version, status } = req.body;
  const rel = await prisma.release.create({ data: { version, status } });
  res.status(201).json(rel);
};

// Sprints
export const getSprints = async (req, res) => {
  const sprints = await prisma.sprint.findMany();
  res.json(sprints);
};

export const createSprint = async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  const sprint = await prisma.sprint.create({ data: { name, startDate: new Date(startDate), endDate: new Date(endDate), status } });
  res.status(201).json(sprint);
};

// AI
export const askAI = async (req, res) => {
  const { prompt } = req.body;
  res.json({ answer: `Mock AI response for: ${prompt}` });
};

// Security
export const getSecurityLogs = async (req, res) => {
  const logs = await prisma.loginHistory.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  res.json(logs);
};

// Activity
export const getActivity = async (req, res) => {
  const activity = await prisma.userActivity.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  res.json(activity);
};

// Dashboard Layout
export const saveLayout = async (req, res) => {
  const { userId, layout } = req.body;
  // Upsert layout
  const saved = await prisma.dashboardLayout.create({
    data: { userId, layout: JSON.stringify(layout) }
  });
  res.json(saved);
};

export const getLayout = async (req, res) => {
  const { userId } = req.params;
  const layout = await prisma.dashboardLayout.findFirst({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' }
  });
  res.json(layout);
};
