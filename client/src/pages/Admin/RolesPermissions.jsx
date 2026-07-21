import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Chip, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const roles = [
  "Super Admin", "Admin", "QA Manager", "QA Lead", 
  "Automation Engineer", "Manual Tester", "Developer", "Viewer"
];

const modules = [
  "Projects", "Test Runs", "Bugs", "Reports", "GitHub", "Jenkins", "Settings"
];

const permissionsMatrix = {
  "Super Admin": { all: true },
  "Admin": { all: true },
  "QA Manager": { 
    Projects: ['View', 'Create', 'Edit', 'Delete', 'Export'],
    "Test Runs": ['View', 'Create', 'Edit', 'Delete', 'Export'],
    Bugs: ['View', 'Create', 'Edit', 'Delete', 'Export'],
    Reports: ['View', 'Export'],
    GitHub: ['View'],
    Jenkins: ['View'],
    Settings: []
  },
  "QA Lead": {
    Projects: ['View', 'Create', 'Edit', 'Export'],
    "Test Runs": ['View', 'Create', 'Edit', 'Export'],
    Bugs: ['View', 'Create', 'Edit', 'Export'],
    Reports: ['View', 'Export'],
    GitHub: ['View'],
    Jenkins: ['View'],
    Settings: []
  },
  "Automation Engineer": {
    Projects: ['View'],
    "Test Runs": ['View', 'Create', 'Edit'],
    Bugs: ['View', 'Create', 'Edit'],
    Reports: ['View'],
    GitHub: ['View', 'Create'],
    Jenkins: ['View', 'Create'],
    Settings: []
  },
  "Manual Tester": {
    Projects: ['View'],
    "Test Runs": ['View', 'Create', 'Edit'],
    Bugs: ['View', 'Create', 'Edit'],
    Reports: ['View'],
    GitHub: [],
    Jenkins: [],
    Settings: []
  },
  "Developer": {
    Projects: ['View'],
    "Test Runs": ['View'],
    Bugs: ['View', 'Edit'],
    Reports: ['View'],
    GitHub: ['View'],
    Jenkins: ['View'],
    Settings: []
  },
  "Viewer": {
    Projects: ['View'],
    "Test Runs": ['View'],
    Bugs: ['View'],
    Reports: ['View'],
    GitHub: ['View'],
    Jenkins: ['View'],
    Settings: []
  }
};

const actions = ["View", "Create", "Edit", "Delete", "Export"];

export default function RolesPermissions() {
  const [selectedRole, setSelectedRole] = React.useState("QA Manager");

  const hasPermission = (module, action) => {
    if (permissionsMatrix[selectedRole].all) return true;
    return permissionsMatrix[selectedRole][module]?.includes(action) || false;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {roles.map(role => (
          <Chip 
            key={role} 
            label={role} 
            onClick={() => setSelectedRole(role)}
            color={selectedRole === role ? "primary" : "default"}
            variant={selectedRole === role ? "filled" : "outlined"}
            sx={{ fontWeight: selectedRole === role ? 700 : 400 }}
          />
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" fontWeight="700">Permissions for {selectedRole}</Typography>
          <Button variant="contained" startIcon={<SaveIcon />}>Save Changes</Button>
        </Box>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
              {actions.map(action => (
                <TableCell key={action} align="center" sx={{ fontWeight: 700 }}>{action}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map(module => (
              <TableRow key={module} hover>
                <TableCell sx={{ fontWeight: 600 }}>{module}</TableCell>
                {actions.map(action => (
                  <TableCell key={`${module}-${action}`} align="center">
                    <Checkbox 
                      checked={hasPermission(module, action)} 
                      color="primary"
                      disabled={permissionsMatrix[selectedRole].all}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
