import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import testRunRoutes from "./routes/testRunRoutes.js";
import bugRoutes from "./routes/bugRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import reportScheduleRoutes from "./routes/reportScheduleRoutes.js";
import filterPresetRoutes from "./routes/filterPresetRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import githubRoutes from "./modules/github/github.routes.js";
import githubWorkflowRoutes from "./routes/githubWorkflowRoutes.js";
import cicdRoutes from "./modules/cicd/cicd.routes.js";
import testResultRoutes from "./modules/testResults/testResult.routes.js";
import jiraRoutes from "./routes/jiraRoutes.js";
import jenkinsRoutes from "./routes/jenkinsRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import sprint3Routes from "./routes/sprint3Routes.js";

import { protect } from "./middleware/authMiddleware.js";

const app = express();

// Security and Logging middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Keep disabled to allow visual resources if needed locally
}));
app.use(morgan("dev"));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get("/", (req, res) => {
  res.send({ status: "OK", server: "QA Analytics Dashboard API" });
});

// Authentication endpoints (Public)
app.use("/api/auth", authRoutes);

// Protected API routes
app.use("/api/projects", protect, projectRoutes);
app.use("/api/test-runs", protect, testRunRoutes);
app.use("/api/bugs", protect, bugRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/reports", protect, reportRoutes);
app.use("/api/analytics", protect, analyticsRoutes);
app.use("/api/audit-logs", protect, auditLogRoutes);
app.use("/api/report-schedules", protect, reportScheduleRoutes);
app.use("/api/filter-presets", protect, filterPresetRoutes);
app.use("/api/integrations", protect, integrationRoutes);
app.use("/api/import", importRoutes); // Protect is applied in the route itself
app.use("/api/webhooks", webhookRoutes); // Public endpoints, validated via apiKey query param
app.use("/api/users", protect, userRoutes);
app.use("/api/admin", protect, adminRoutes);
app.use("/api/github", protect, githubWorkflowRoutes);
app.use("/api/github", protect, githubRoutes);
app.use("/api/cicd", protect, cicdRoutes);
app.use("/api/test-results", protect, testResultRoutes);
app.use("/api/jira", protect, jiraRoutes);
app.use("/api/jenkins", protect, jenkinsRoutes);
app.use("/api/teams", protect, teamRoutes);

// Sprint 3 New Routes
app.use("/api", sprint3Routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err.stack);
  res.status(500).json({
    message: "Internal server error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

export default app;
