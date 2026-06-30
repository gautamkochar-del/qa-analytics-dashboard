import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the prisma config module
vi.mock("../config/prisma.js", () => {
  return {
    default: {
      testRun: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

import prisma from "../config/prisma.js";
import { getAllTestRuns, createTestRun } from "./testRunService";

describe("TestRun Service Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return query results and counts for list view", async () => {
    const mockRuns = [
      { id: 1, suiteName: "Smoke", total: 10, passed: 8, failed: 2, executionDate: new Date() },
    ];
    prisma.testRun.findMany.mockResolvedValue(mockRuns);
    prisma.testRun.count.mockResolvedValue(1);

    const result = await getAllTestRuns({ page: 1, limit: 10 });

    expect(result.data).toEqual(mockRuns);
    expect(result.total).toBe(1);
    expect(prisma.testRun.findMany).toHaveBeenCalled();
  });

  it("should create new test run resolving statuses automatically", async () => {
    const data = {
      projectId: 1,
      suiteName: "Regression",
      total: 50,
      passed: 48,
      failed: 2,
    };

    prisma.testRun.create.mockResolvedValue({
      id: 1,
      ...data,
      status: "failed",
      executionDate: new Date(),
    });

    const result = await createTestRun(data);

    expect(result.id).toBe(1);
    expect(prisma.testRun.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "failed",
        }),
      })
    );
  });
});
