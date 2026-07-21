import express from "express";

const router = express.Router();

router.get("/builds", (req, res) => {
  res.json([
    { id: 582, status: "SUCCESS", duration: "4m 15s", environment: "QA", triggeredBy: "Gautam Kochar" },
    { id: 581, status: "FAILED", duration: "2m 10s", environment: "QA", triggeredBy: "Auto" }
  ]);
});

router.get("/history", (req, res) => {
  res.json([
    { build: "#582", status: "success" },
    { build: "#581", status: "failed" },
    { build: "#580", status: "success" },
  ]);
});

export default router;
