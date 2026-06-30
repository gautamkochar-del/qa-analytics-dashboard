import prisma from "../config/prisma.js";

export const getAllProjects = async () => {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProjectById = async (id) => {
  return prisma.project.findUnique({
    where: { id: Number(id) },
  });
};

export const createProject = async (data) => {
  return prisma.project.create({
    data,
  });
};

export const updateProject = async (id, data) => {
  return prisma.project.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteProject = async (id) => {
  return prisma.project.delete({
    where: { id: Number(id) },
  });
};
