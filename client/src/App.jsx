import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import { useAuth } from "./context/AuthContext";

// Lazy load pages for Code Splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExecutiveDashboard = lazy(() => import("./pages/ExecutiveDashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const TestRuns = lazy(() => import("./pages/TestRuns"));
const TestRunDetails = lazy(() => import("./pages/TestRunDetails"));
const Bugs = lazy(() => import("./pages/Bugs"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const GitHub = lazy(() => import("./pages/GitHub"));
const GitHubActions = lazy(() => import("./pages/GitHubActions"));
const GitHubWorkflowDetails = lazy(() => import("./pages/GitHubWorkflowDetails"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Login = lazy(() => import("./pages/Login"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const Integrations = lazy(() => import("./pages/Integrations"));
const CicdDashboard = lazy(() => import("./pages/CicdDashboard"));
const AdminPanel = lazy(() => import("./pages/Admin/AdminPanel"));
const Teams = lazy(() => import("./pages/Teams"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const JiraDashboard = lazy(() => import("./pages/JiraDashboard"));
const TestCases = lazy(() => import("./pages/TestCases"));
const ReleaseManagement = lazy(() => import("./pages/ReleaseManagement"));
const SprintBoard = lazy(() => import("./pages/SprintBoard"));
const ApiMonitoring = lazy(() => import("./pages/ApiMonitoring"));

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {isAuthenticated && (
        <Box
          sx={{
            width: 260,
            minWidth: 260,
            flexShrink: 0,
          }}
        >
          <Sidebar />
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isAuthenticated && <Navbar />}

        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: "auto",
          }}
        >
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 10 }}>
              <CircularProgress />
            </Box>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/executive"
                element={
                  <ProtectedRoute>
                    <ExecutiveDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tests"
                element={
                  <ProtectedRoute>
                    <TestRuns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tests/:id"
                element={
                  <ProtectedRoute>
                    <TestRunDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bugs"
                element={
                  <ProtectedRoute>
                    <Bugs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cicd"
                element={
                  <ProtectedRoute>
                    <CicdDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/github"
                element={
                  <ProtectedRoute>
                    <GitHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/github-actions"
                element={
                  <ProtectedRoute>
                    <GitHubActions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/github-actions/:owner/:repo/runs/:runId"
                element={
                  <ProtectedRoute>
                    <GitHubWorkflowDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <Teams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jira"
                element={
                  <ProtectedRoute>
                    <JiraDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-cases"
                element={
                  <ProtectedRoute>
                    <TestCases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/releases"
                element={
                  <ProtectedRoute>
                    <ReleaseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sprint-board"
                element={
                  <ProtectedRoute>
                    <SprintBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/api-monitoring"
                element={
                  <ProtectedRoute>
                    <ApiMonitoring />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Box>
        {isAuthenticated && <AIAssistant />}
      </Box>
    </Box>
  );
}

export default App;
