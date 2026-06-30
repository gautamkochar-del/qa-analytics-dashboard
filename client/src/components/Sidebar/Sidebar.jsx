import { NavLink } from "react-router-dom";
import { Box, Typography, Button, IconButton, useTheme, Divider } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import BugReportIcon from "@mui/icons-material/BugReport";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { mode, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> }, { name: "Projects", path: "/projects", icon: <FolderIcon fontSize="small" /> }, { name: "Test Runs", path: "/tests", icon: <PlaylistPlayIcon fontSize="small" /> }, { name: "Bugs", path: "/bugs", icon: <BugReportIcon fontSize="small" /> }, { name: "Analytics", path: "/analytics", icon: <AnalyticsIcon fontSize="small" /> }, { name: "Reports", path: "/reports", icon: <AssessmentIcon fontSize="small" /> }, { name: "CI/CD", path: "/cicd", icon: <AccountTreeIcon fontSize="small" /> }, { name: "Settings", path: "/settings", icon: <SettingsIcon fontSize="small" /> }, ];

  if (user?.role === "Admin") {
    menuItems.push({ name: "Audit Logs", path: "/audit-logs", icon: <SecurityIcon fontSize="small" /> });
    menuItems.push({ name: "Integrations", path: "/integrations", icon: <IntegrationInstructionsIcon fontSize="small" /> });
    menuItems.push({ name: "Admin Panel", path: "/admin", icon: <SecurityIcon fontSize="small" /> });
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 250, bgcolor: mode === "light" ? "background.paper" : "#0f172a", color: "text.primary", minHeight: "100vh", display: "flex", flexDirection: "column", borderRight: `1px solid ${theme.palette.divider}`, padding: "25px 20px", }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 850, letterSpacing: "-0.03em" }}>
          QA<span style={{ color: "#10b981" }}>Dash</span>
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" size="small">
          {mode === "dark" ? <LightModeIcon size="small" /> : <DarkModeIcon size="small" />}
        </IconButton>
      </Box>

      {/* Navigation menu list */}
      <Box sx={{ flexGrow: 1 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: "8px" }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "8px", color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary, backgroundColor: isActive
                    ? mode === "light"
                      ? "#eff6ff"
                      : "#1e293b"
                    : "transparent", textDecoration: "none", fontWeight: isActive ? "600" : "500", transition: "all 0.2s ease-in-out", })}
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* User Information and Sign Out */}
      {user && (
        <Box>
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 650, color: "text.primary" }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              {user.role}
            </Typography>
          </Box>
          
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              borderRadius: "8px", py: 0.8, fontWeight: 600, }}
          >
            Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );
}
