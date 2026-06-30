import prisma from "../config/prisma.js";

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
    { name: "Passed", value: passed },
    { name: "Failed", value: failed },
  ];
};

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
