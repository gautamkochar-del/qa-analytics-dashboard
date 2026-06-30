import prisma from "../config/prisma.js";

/* ============================================
   Dashboard Summary
============================================ */

export const getDashboard = async (req, res) => {
  try {
    const totalProjects = await prisma.project.count();

    const totalTestRuns = await prisma.testRun.count();

    const totalBugs = await prisma.bug.count();

    const openBugs = await prisma.bug.count({
      where: {
        status: "Open",
      },
    });

    const stats = await prisma.testRun.aggregate({
      _sum: {
        total: true,
        passed: true,
        failed: true,
      },
    });

    const totalTests = stats._sum.total || 0;
    const passed = stats._sum.passed || 0;
    const failed = stats._sum.failed || 0;

    const passRate =
      totalTests === 0
        ? 0
        : Math.round((passed / totalTests) * 100);

    res.json({
      totalProjects,
      totalTestRuns,
      totalTests,
      passed,
      failed,
      passRate,
      totalBugs,
      openBugs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};

/* ============================================
   Recent Test Runs
============================================ */

export const getRecentTestRuns = async (req, res) => {
  try {
    const runs = await prisma.testRun.findMany({
      include: {
        project: true,
      },
      orderBy: {
        executionDate: "desc",
      },
      take: 5,
    });

    const recentRuns = runs.map((run) => ({
      id: run.id,
      project: run.project.name,
      total: run.total,
      passed: run.passed,
      failed: run.failed,
      executionDate: run.executionDate,
      passRate:
        run.total === 0
          ? 0
          : Math.round((run.passed / run.total) * 100),
    }));

    res.json(recentRuns);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load recent test runs",
    });
  }
};

/* ============================================
   Recent Bugs
============================================ */
export const getRecentBugs = async (req, res) => {
  try {
    const bugs = await prisma.bug.findMany({
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const recentBugs = bugs.map((bug) => ({
      id: bug.id,
      title: bug.title,
      severity: bug.severity,
      status: bug.status,
      project: bug.project.name,
      createdAt: bug.createdAt,
    }));

    res.json(recentBugs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load recent bugs",
    });
  }
};

/* ============================================
   Project Health
============================================ */
export const getProjectHealth = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        testRuns: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const health = projects.map((project) => {
      const total = project.testRuns.reduce(
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

      const passRate =
        total === 0
          ? 0
          : Math.round((passed / total) * 100);

      return {
        id: project.id,
        name: project.name,
        total,
        passed,
        failed,
        passRate,
      };
    });

    res.json(health);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load project health",
    });
  }
};

/* ============================================
   Recent Activity
============================================ */
export const getRecentActivity = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const testRuns = await prisma.testRun.findMany({
      include: {
        project: true,
      },
      take: 5,
      orderBy: {
        executionDate: "desc",
      },
    });

    const bugs = await prisma.bug.findMany({
      include: {
        project: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const activities = [
      ...projects.map((project) => ({
        type: "project",
        title: `Project created: ${project.name}`,
        date: project.createdAt,
      })),

      ...bugs.map((bug) => ({
        type: "bug",
        title: `Bug: ${bug.title}`,
        subtitle: bug.project.name,
        date: bug.createdAt,
      })),

      ...testRuns.map((run) => ({
        type: "testrun",
        title: `${run.project.name} executed`,
        subtitle: `${run.passed}/${run.total} Passed`,
        date: run.executionDate,
      })),
    ];

    activities.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load activity",
    });
  }
};
