import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import testRunRoutes from "./routes/testRunRoutes.js";
import bugRoutes from "./routes/bugRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/test-runs", testRunRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "QA Analytics Dashboard API is running 🚀",
  });
});

export default app;
