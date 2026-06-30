import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Lazy load pages for Code Splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const TestRuns = lazy(() => import("./pages/TestRuns"));
const Bugs = lazy(() => import("./pages/Bugs"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Login = lazy(() => import("./pages/Login"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const Integrations = lazy(() => import("./pages/Integrations"));
const CicdDashboard = lazy(() => import("./pages/CicdDashboard"));
const AdminPanel = lazy(() => import("./pages/Admin/AdminPanel"));

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div
        style={{
            display: "flex",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
            background: "#f5f7fb",
        }}
    >
      {isAuthenticated && <Sidebar />}

      <div
          style={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              overflow: "auto",
          }}
      >
        {isAuthenticated && <Navbar />}

        <div
            style={{
                padding: 24,
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
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
