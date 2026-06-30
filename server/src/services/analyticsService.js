import prisma from "../config/prisma.js";

// 1. Heatmap: test runs executed per day
export const getExecutionHeatmap = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const testRuns = await prisma.testRun.findMany({
    where: {
      executionDate: {
        gte: startDate,
      },
    },
    select: {
      executionDate: true,
      total: true,
    },
  });

  const heatmap = {};
  testRuns.forEach((run) => {
    const dateStr = run.executionDate.toISOString().split("T")[0];
    if (!heatmap[dateStr]) {
      heatmap[dateStr] = { date: dateStr, count: 0, totalTests: 0 };
    }
    heatmap[dateStr].count += 1;
    heatmap[dateStr].totalTests += run.total;
  });

  return Object.values(heatmap).sort((a, b) => a.date.localeCompare(b.date));
};

// 2. Flaky tests: test suites transitioning between pass and fail
export const getFlakyTests = async () => {
  // We can look at projects and suites that have both successful and failed test runs
  const testRuns = await prisma.testRun.findMany({
    include: {
      project: true,
    },
    orderBy: {
      executionDate: "desc",
    },
  });

  // Group by project + suiteName
  const suiteGroups = {};
  testRuns.forEach((run) => {
    const key = `${run.project.name} - ${run.suiteName}`;
    if (!suiteGroups[key]) {
      suiteGroups[key] = {
        projectName: run.project.name,
        suiteName: run.suiteName,
        runs: [],
      };
    }
    suiteGroups[key].runs.push(run.status);
  });

  const flakySuites = [];
  Object.entries(suiteGroups).forEach(([name, group]) => {
    const runs = group.runs;
    if (runs.length >= 3) {
      // If a suite contains both "passed" and "failed" in its recent history, it could be flaky
      const hasPassed = runs.includes("passed");
      const hasFailed = runs.includes("failed");

      if (hasPassed && hasFailed) {
        // Calculate instability score: percentage of status transitions
        let transitions = 0;
        for (let i = 0; i < runs.length - 1; i++) {
          if (runs[i] !== runs[i + 1]) {
            transitions++;
          }
        }
        const instabilityRate = Math.round((transitions / (runs.length - 1)) * 100);

        flakySuites.push({
          suite: group.suiteName,
          project: group.projectName,
          totalRuns: runs.length,
          failures: runs.filter(r => r === "failed").length,
          instabilityRate,
        });
      }
    }
  });

  return flakySuites.sort((a, b) => b.instabilityRate - a.instabilityRate);
};

// 3. Average duration of test executions over time
export const getDurationTrends = async () => {
  const testRuns = await prisma.testRun.findMany({
    where: {
      duration: {
        gt: 0,
      },
    },
    include: {
      project: true,
    },
    orderBy: {
      executionDate: "asc",
    },
  });

  // Group durations by date and project
  const trendsByDate = {};
  testRuns.forEach((run) => {
    const dateStr = run.executionDate.toISOString().split("T")[0];
    if (!trendsByDate[dateStr]) {
      trendsByDate[dateStr] = { date: dateStr, count: 0, totalDuration: 0 };
    }
    trendsByDate[dateStr].count++;
    trendsByDate[dateStr].totalDuration += run.duration;
  });

  return Object.values(trendsByDate).map((t) => ({
    date: t.date,
    avgDuration: Math.round(t.totalDuration / t.count), // avg in seconds
  }));
};

// 4. Detailed Bug Breakdown (resolution speed, module concentration)
export const getBugResolutionStats = async () => {
  const bugs = await prisma.bug.findMany({
    include: {
      project: true,
    },
  });

  const moduleStats = {};
  const statusStats = { Open: 0, "In Progress": 0, Closed: 0 };
  const severityStats = { Critical: 0, High: 0, Medium: 0, Low: 0 };

  bugs.forEach((bug) => {
    // Module breakdown
    const mod = bug.module || "General";
    if (!moduleStats[mod]) {
      moduleStats[mod] = { module: mod, count: 0, Open: 0, Resolved: 0 };
    }
    moduleStats[mod].count++;
    if (bug.status === "Closed") {
      moduleStats[mod].Resolved++;
    } else {
      moduleStats[mod].Open++;
    }

    // Status breakdown
    if (statusStats[bug.status] !== undefined) {
      statusStats[bug.status]++;
    } else {
      // Handle mapping deviations safely
      const normStatus = bug.status.toLowerCase().includes("progress") ? "In Progress" : 
                         (bug.status.toLowerCase().includes("closed") || bug.status.toLowerCase().includes("resolve") ? "Closed" : "Open");
      statusStats[normStatus]++;
    }

    // Severity breakdown
    if (severityStats[bug.severity] !== undefined) {
      severityStats[bug.severity]++;
    }
  });

  return {
    moduleDistribution: Object.values(moduleStats),
    statusBreakdown: Object.entries(statusStats).map(([name, value]) => ({ name, value })),
    severityBreakdown: Object.entries(severityStats).map(([name, value]) => ({ name, value })),
  };
};
