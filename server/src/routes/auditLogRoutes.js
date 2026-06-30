import express from "express";
import prisma from "../config/prisma.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";

const router = express.Router();

router.get("/", authorizeRoles("Admin"), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(logs);
  } catch (error) {
    console.error("Failed to fetch audit logs", error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
});

export default router;
