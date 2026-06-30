import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/prisma.js", () => {
  return {
    default: {
      project: { count: vi.fn(), findMany: vi.fn() },
      testRun: { findMany: vi.fn() },
      bug: { count: vi.fn(), findMany: vi.fn() },
    },
  };
});

import prisma from "../config/prisma.js";
import { getDashboardSummary, getPassFailChart, getBugSeverity } from "./dashboardService";

describe("Dashboard Service Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should calculate correctly dashboard summary statistics", async () => {
    prisma.project.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(8);  // active
    
    prisma.testRun.findMany.mockResolvedValue([
      { total: 10, passed: 8, failed: 2 },
      { total: 5, passed: 5, failed: 0 },
    ]);

    prisma.bug.count.mockResolvedValue(4);

    const summary = await getDashboardSummary();

    expect(summary.projects).toBe(10);
    expect(summary.activeProjects).toBe(8);
    expect(summary.testRuns).toBe(2);
    expect(summary.passed).toBe(13);
    expect(summary.failed).toBe(2);
    expect(summary.openBugs).toBe(4);
  });

  it("should return pass/fail array layout", async () => {
    prisma.testRun.findMany.mockResolvedValue([
      { total: 10, passed: 9, failed: 1 },
    ]);

    const result = await getPassFailChart();

    expect(result).toEqual([
      { name: "Passed", value: 9 },
      { name: "Failed", value: 1 },
    ]);
  });

  it("should calculate bug severities array structure", async () => {
    prisma.bug.findMany.mockResolvedValue([
      { severity: "Critical" },
      { severity: "Critical" },
      { severity: "High" },
    ]);

    const result = await getBugSeverity();

    expect(result).toContainEqual({ name: "Critical", value: 2 });
    expect(result).toContainEqual({ name: "High", value: 1 });
    expect(result).toContainEqual({ name: "Medium", value: 0 });
    expect(result).toContainEqual({ name: "Low", value: 0 });
  });
});
