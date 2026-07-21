import express from "express";
import * as teamController from "../controllers/teamController.js";

const router = express.Router();

router.get("/", teamController.getTeams);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);
router.get("/departments", teamController.getDepartments);

export default router;
