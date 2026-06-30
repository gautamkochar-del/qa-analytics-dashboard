import express from "express";
import prisma from "../config/prisma.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/:resourceType", async (req, res) => {
  try {
    const presets = await prisma.filterPreset.findMany({
      where: {
        userId: req.user.id,
        resourceType: req.params.resourceType,
      },
    });
    res.json(presets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch filter presets" });
  }
});

router.post(
  "/",
  auditLog("FilterPreset"),
  async (req, res) => {
    try {
      const { name, resourceType, filterData } = req.body;
      const preset = await prisma.filterPreset.create({
        data: {
          name,
          resourceType,
          filterData: JSON.stringify(filterData),
          userId: req.user.id,
        },
      });
      res.status(201).json(preset);
    } catch (error) {
      res.status(500).json({ message: "Failed to create filter preset" });
    }
  }
);

router.delete(
  "/:id",
  auditLog("FilterPreset"),
  async (req, res) => {
    try {
      await prisma.filterPreset.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ message: "Preset deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete filter preset" });
    }
  }
);

export default router;
