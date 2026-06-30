import express from "express";
import * as integrationService from "../services/integrationService.js";
import { authorizeRoles } from "../middleware/rbacMiddleware.js";
import { auditLog } from "../middleware/auditMiddleware.js";

const router = express.Router();

// Only Admins can manage integrations
router.use(authorizeRoles("Admin"));

router.get("/", async (req, res) => {
  try {
    const integrations = await integrationService.getIntegrations();
    res.json(integrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load integrations" });
  }
});

router.post("/", auditLog("CREATE", "Integration"), async (req, res) => {
  try {
    const integration = await integrationService.createIntegration(req.user.id, req.body);
    res.status(201).json(integration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create integration" });
  }
});

router.put("/:id", auditLog("UPDATE", "Integration"), async (req, res) => {
  try {
    const integration = await integrationService.updateIntegration(req.params.id, req.body);
    res.json(integration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update integration" });
  }
});

router.delete("/:id", auditLog("DELETE", "Integration"), async (req, res) => {
  try {
    await integrationService.deleteIntegration(req.params.id);
    res.json({ message: "Integration deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete integration" });
  }
});

export default router;
