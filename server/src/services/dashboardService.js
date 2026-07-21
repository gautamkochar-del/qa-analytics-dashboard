import prisma from "../config/prisma.js";

/* ============================================
   Dashboard Summary
============================================ */

export const getDashboardSummary = async () => {
  const totalProjects = await prisma.project.count();

  const activeProjects = await prisma.project.count({
    where: {
      status: "Active",
    },
  });

  const testRuns = await prisma.testRun.findMany();

  const totalRuns = testRuns.length;

  const passed = testRuns.reduce(
    (sum, run) => sum + run.passed,
    0
  );

  const failed = testRuns.reduce(
    (sum, run) => sum + run.failed,
    0
  );

  const openBugs = await prisma.bug.count({
    where: {
      status: "Open",
    },
  });

  return {
    projects: totalProjects,
    activeProjects,
    testRuns: totalRuns,
    passed,
    failed,
    openBugs,
  };
};

/* ============================================
   Pass / Fail Chart
============================================ */

export const getPassFailChart = async () => {
  const testRuns = await prisma.testRun.findMany();

  const passed = testRuns.reduce(
    (sum, run) => sum + run.passed,
    0
  );

  const failed = testRuns.reduce(
    (sum, run) => sum + run.failed,
    0
  );

  return [
    {
      name: "Passed",
      value: passed,
    },
    {
      name: "Failed",
      value: failed,
    },
  ];
};

/* ============================================
   Execution Trend
============================================ */

export const getExecutionTrend = async () => {
  const testRuns = await prisma.testRun.findMany({
    orderBy: {
      executionDate: "asc",
    },
  });

  return testRuns.map((run) => ({
    date: run.executionDate.toISOString().split("T")[0],
    total: run.total,
    passed: run.passed,
    failed: run.failed,
  }));
};

/* ============================================
   Bug Severity
============================================ */

export const getBugSeverity = async () => {
  const bugs = await prisma.bug.findMany();

  const summary = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  bugs.forEach((bug) => {
    if (summary[bug.severity] !== undefined) {
      summary[bug.severity]++;
    }
  });

  return Object.entries(summary).map(([name, value]) => ({
    name,
    value,
  }));
};

/* ============================================
   Recent Test Runs
============================================ */

export const getRecentTestRuns = async () => {
  const runs = await prisma.testRun.findMany({
    include: {
      project: true,
    },
    orderBy: {
      executionDate: "desc",
    },
    take: 5,
  });

  return runs.map((run) => ({
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
};

/* ============================================
   Recent Bugs
============================================ */

export const getRecentBugs = async () => {
  const bugs = await prisma.bug.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return bugs.map((bug) => ({
    id: bug.id,
    title: bug.title,
    severity: bug.severity,
    status: bug.status,
    project: bug.project.name,
    createdAt: bug.createdAt,
  }));
};

/* ============================================
   Project Health
============================================ */

export const getProjectHealth = async () => {
  const projects = await prisma.project.findMany({
    include: {
      testRuns: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects.map((project) => {
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
};

/* ============================================
   Recent Activity
============================================ */

export const getRecentActivity = async () => {
  const projects = await prisma.project.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
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

  const testRuns = await prisma.testRun.findMany({
    include: {
      project: true,
    },
    take: 5,
    orderBy: {
      executionDate: "desc",
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

  return activities.slice(0, 10);
};

/* ============================================
   Notifications
============================================ */
export const getNotifications = async () => {
  return [
    { id: 1, type: 'success', text: 'Build #245 Passed', project: 'Platform' },
    { id: 2, type: 'success', text: '35 Tests Imported', project: 'API' },
    { id: 3, type: 'warning', text: 'Regression Failed', project: 'Web' },
    { id: 4, type: 'success', text: 'PR Merged', project: 'Mobile' },
  ];
};

/* ============================================
   Team Activity
============================================ */
export const getTeamActivity = async () => {
  return {
    todayRuns: 142,
    todayBugs: 12,
    activeUsers: 8,
    reportsGenerated: 24,
    executedTests: 1264,
    resolvedBugs: 14,
    commits: 32,
    deployments: 5
  };
};

/* ============================================
   AI Insights
============================================ */
export const getInsights = async () => {
  return [
    { id: 1, text: "Pass Rate improved by 3%", type: 'positive' },
    { id: 2, text: "Regression Suite has failed 3 consecutive runs", type: 'negative' },
    { id: 3, text: "Open Bugs reduced by 18%", type: 'positive' },
    { id: 4, text: "Automation Coverage increased", type: 'positive' },
  ];
};
