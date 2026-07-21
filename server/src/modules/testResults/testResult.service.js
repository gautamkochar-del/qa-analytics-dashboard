import prisma from "../../config/prisma.js";

export const getTestCasesForRun = async (testRunId) => {
  return prisma.testCaseResult.findMany({
    where: { testRunId: Number(testRunId) },
    orderBy: { createdAt: "asc" },
  });
};

export const getTestCaseById = async (id) => {
  return prisma.testCaseResult.findUnique({
    where: { id: Number(id) },
  });
};

export const updateTestCase = async (id, data) => {
  return prisma.testCaseResult.update({
    where: { id: Number(id) },
    data,
  });
};
