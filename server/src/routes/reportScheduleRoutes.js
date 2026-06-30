import express from "express";
import prisma from "../config/prisma.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

// GET all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await prisma.reportSchedule.findMany({
      include: {
        creator: { select: { id: true, name: true } },
        histories: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
});

// POST create schedule
router.post(
  "/",
  authorizeRoles("Admin", "QA Lead"),
  auditLog("ReportSchedule"),
  async (req, res) => {
    try {
      const { name, frequency, recipients } = req.body;
      const schedule = await prisma.reportSchedule.create({
        data: {
          name,
          frequency,
          recipients: JSON.stringify(recipients),
          creatorId: req.user.id,
        },
      });
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to create schedule" });
    }
  }
);

// DELETE schedule
router.delete(
  "/:id",
  authorizeRoles("Admin", "QA Lead"),
  auditLog("ReportSchedule"),
  async (req, res) => {
    try {
      await prisma.reportSchedule.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ message: "Schedule deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  }
);

export default router;
