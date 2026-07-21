import { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import UserManagement from "./UserManagement";
import DepartmentsTeams from "./DepartmentsTeams";
import RolesPermissions from "./RolesPermissions";

export default function AdminPanel() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, roles, departments, and teams.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Users" />
          <Tab label="Departments & Teams" />
          <Tab label="Roles & Permissions" />
        </Tabs>
      </Paper>

      {tabValue === 0 && <UserManagement />}
      {tabValue === 1 && <DepartmentsTeams />}
      {tabValue === 2 && <RolesPermissions />}
    </Box>
  );
}
