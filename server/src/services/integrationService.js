import prisma from "../config/prisma.js";

// Basic CRUD for Integrations
export const getIntegrations = async () => {
  return prisma.integration.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getIntegrationById = async (id) => {
  return prisma.integration.findUnique({
    where: { id: Number(id) },
  });
};

export const createIntegration = async (userId, data) => {
  return prisma.integration.create({
    data: {
      provider: data.provider,
      name: data.name,
      url: data.url,
      apiKey: data.apiKey, // In a real prod app, encrypt this before saving
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      userId: Number(userId),
    },
  });
};

export const updateIntegration = async (id, data) => {
  return prisma.integration.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      url: data.url,
      apiKey: data.apiKey,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      isActive: data.isActive,
    },
  });
};

export const deleteIntegration = async (id) => {
  return prisma.integration.delete({
    where: { id: Number(id) },
  });
};
