import prisma from "../config/prisma.js";

export const getAllTestRuns = async (options = {}) => {
  const {
    projectId,
    status,
    environment,
    search,
    page = 1,
    limit = 10,
    sortBy = "executionDate",
    sortOrder = "desc",
  } = options;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  // Build filter conditions
  const where = {};

  if (projectId) {
    where.projectId = parseInt(projectId);
  }

  if (status && status !== "all") {
    where.status = status.toLowerCase();
  }

  if (environment && environment !== "all") {
    where.environment = environment;
  }

  if (search) {
    where.OR = [
      {
        suiteName: {
          contains: search,
        },
      },
      {
        project: {
          name: {
            contains: search,
          },
        },
      },
    ];
  }

  // Validate sortBy
  const validSortFields = ["executionDate", "total", "passed", "failed", "duration", "status", "suiteName"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "executionDate";
  const orderDirection = ["asc", "desc"].includes(sortOrder.toLowerCase())
    ? sortOrder.toLowerCase()
    : "desc";

  const [data, total] = await Promise.all([
    prisma.testRun.findMany({
      where,
      include: {
        project: true,
      },
      orderBy: {
        [orderField]: orderDirection,
      },
      skip,
      take: limitNum,
    }),
    prisma.testRun.count({ where }),
  ]);

  return {
    data,
    total,
    page: pageNum,
    limit: limitNum,
  };
};

export const getTestRunById = (id) => {
  return prisma.testRun.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      project: true,
    },
  });
};

export const createTestRun = async (data) => {
  const passed = Number(data.passed || 0);
  const failed = Number(data.failed || 0);
  const skipped = Number(data.skipped || 0);
  const total = Number(data.total || (passed + failed + skipped));

  // Determine status automatically if not provided
  let status = data.status;
  if (!status) {
    status = failed > 0 ? "failed" : "passed";
  }

  return prisma.testRun.create({
    data: {
      projectId: Number(data.projectId),
      suiteName: data.suiteName || "Default Suite",
      environment: data.environment || "QA",
      status: status.toLowerCase(),
      total,
      passed,
      failed,
      skipped,
      duration: Number(data.duration || 0),
      executionDate: data.executionDate ? new Date(data.executionDate) : new Date(),
    },
  });
};

export const updateTestRun = async (id, data) => {
  const passed = Number(data.passed || 0);
  const failed = Number(data.failed || 0);
  const skipped = Number(data.skipped || 0);
  const total = Number(data.total || (passed + failed + skipped));

  let status = data.status;
  if (!status) {
    status = failed > 0 ? "failed" : "passed";
  }

  return prisma.testRun.update({
    where: {
      id: Number(id),
    },
    data: {
      projectId: Number(data.projectId),
      suiteName: data.suiteName,
      environment: data.environment,
      status: status.toLowerCase(),
      total,
      passed,
      failed,
      skipped,
      duration: Number(data.duration),
      executionDate: data.executionDate ? new Date(data.executionDate) : undefined,
    },
  });
};

export const deleteTestRun = (id) => {
  return prisma.testRun.delete({
    where: {
      id: Number(id),
    },
  });
};
