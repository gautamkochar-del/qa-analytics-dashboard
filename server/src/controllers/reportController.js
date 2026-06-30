import prisma from "../config/prisma.js";

const buildWhereClause = (req, dateField = 'executionDate') => {
  const { project, status, from, to } = req.query;
  const where = {};
  
  if (project) {
    where.project = { name: project };
  }
  
  if (status) {
    where.status = status;
  }
  
  if (from || to) {
    where[dateField] = {};
    if (from) where[dateField].gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      where[dateField].lte = toDate;
    }
  }
  
  return where;
};

/* ======================================================
   Summary
====================================================== */

export const getSummary = async (req, res) => {
  try {
    const totalProjects = await prisma.project.count();

    const totalTestRuns = await prisma.testRun.count();

    const testStats = await prisma.testRun.aggregate({
      _sum: {
        total: true,
        passed: true,
        failed: true,
      },
    });

    const openBugs = await prisma.bug.count({
      where: {
        status: "Open",
      },
    });

    res.json({
      totalProjects,
      totalTestRuns,
      totalTests: testStats._sum.total || 0,
      passed: testStats._sum.passed || 0,
      failed: testStats._sum.failed || 0,
      openBugs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load report summary",
      error: error.message,
    });
  }
};

/* ======================================================
   Pass / Fail Chart
====================================================== */

export const getPassFailChart = async (req, res) => {
  try {
    const where = buildWhereClause(req, 'executionDate');
    const stats = await prisma.testRun.aggregate({
      where,
      _sum: {
        passed: true,
        failed: true,
      },
    });

    res.json([
      {
        name: "Passed",
        value: stats._sum.passed || 0,
      },
      {
        name: "Failed",
        value: stats._sum.failed || 0,
      },
    ]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load pass/fail chart",
    });
  }
};

/* ======================================================
   Bug Severity Chart
====================================================== */

export const getBugSeverityChart = async (req, res) => {
  try {
    const severities = [
      "Critical",
      "High",
      "Medium",
      "Low",
    ];

    const where = buildWhereClause(req, 'createdAt');

    const data = await Promise.all(
      severities.map(async (severity) => ({
        name: severity,
        value: await prisma.bug.count({
          where: {
            ...where,
            severity,
          },
        }),
      }))
    );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load bug severity chart",
    });
  }
};

/* ======================================================
   Project Summary
====================================================== */

export const getProjectSummary = async (req, res) => {
  try {
    const { project, status, from, to } = req.query;
    
    // Project filter
    const projectWhere = {};
    if (project) {
      projectWhere.name = project;
    }
    
    // TestRun relations filter
    const runWhere = {};
    if (status) runWhere.status = status;
    if (from || to) {
      runWhere.executionDate = {};
      if (from) runWhere.executionDate.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        runWhere.executionDate.lte = toDate;
      }
    }
    
    // Bug relations filter
    const bugWhere = {};
    if (status) bugWhere.status = status;
    if (from || to) {
      bugWhere.createdAt = {};
      if (from) bugWhere.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        bugWhere.createdAt.lte = toDate;
      }
    }

    const projects = await prisma.project.findMany({
      where: projectWhere,
      include: {
        testRuns: { where: runWhere },
        bugs: { where: bugWhere },
      },
      orderBy: {
        name: "asc",
      },
    });

    const summary = projects.map((project) => {
      const totalTests = project.testRuns.reduce(
        (sum, run) => sum + run.total,
        0
      );

      const passed = project.testRuns.reduce(
        (sum, run) => sum + run.passed,
        0
      );

      const failed = project.testRuns.reduce(
        (sum, run) => sum + run.failed,
        0
      );

      const openBugs = project.bugs.filter(
        (bug) => bug.status === "Open"
      ).length;

      const passRate =
        totalTests === 0
          ? 0
          : Math.round((passed / totalTests) * 100);

      return {
        id: project.id,
        project: project.name,
        totalTests,
        passed,
        failed,
        passRate,
        openBugs,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load project summary",
    });
  }
};

/* ======================================================
   Execution Trend
====================================================== */

export const getExecutionTrend = async (req, res) => {
  try {
    const where = buildWhereClause(req, 'executionDate');
    const testRuns = await prisma.testRun.findMany({
      where,
      orderBy: {
        executionDate: "asc",
      },
    });

    const grouped = {};

    testRuns.forEach((run) => {
      const date = run.executionDate
        .toISOString()
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = {
          date,
          passed: 0,
          failed: 0,
          total: 0,
        };
      }

      grouped[date].passed += run.passed;
      grouped[date].failed += run.failed;
      grouped[date].total += run.total;
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load execution trend",
    });
  }
};

/* ======================================================
   Bug Trend
====================================================== */

export const getBugTrend = async (req, res) => {
  try {
    const where = buildWhereClause(req, 'createdAt');
    const bugs = await prisma.bug.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    bugs.forEach((bug) => {
      const date = bug.createdAt
        .toISOString()
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = {
          date,
          open: 0,
        };
      }

      if (bug.status === "Open") {
        grouped[date].open++;
      }
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load bug trend",
    });
  }
};
