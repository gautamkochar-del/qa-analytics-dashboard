import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Menu, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockResetIcon from "@mui/icons-material/LockReset";

import * as adminApi from "../../api/adminApi";
import { useAppSnackbar } from "../../context/SnackbarContext";

export default function UserManagement() {
  const { showSnackbar } = useAppSnackbar();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", roleId: "", departmentId: "", teamId: "", });

  const [resetForm, setResetForm] = useState({ password: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, deptsData, teamsData] = await Promise.all([
        adminApi.getUsers(), adminApi.getRoles(), adminApi.getDepartments(), adminApi.getTeams()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setDepartments(deptsData);
      setTeams(teamsData);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load user management data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleOpenForm = (user = null) => {
    handleMenuClose();
    if (user) {
      setSelectedUser(user);
      setForm({
        name: user.name, email: user.email, password: "", roleId: user.role?.id || "", departmentId: user.department?.id || "", teamId: user.team?.id || "", });
    } else {
      setSelectedUser(null);
      setForm({
        name: "", email: "", password: "", roleId: "", departmentId: "", teamId: "", });
    }
    setOpen(true);
  };

  const handleOpenReset = () => {
    setSelectedUser(menuUser);
    handleMenuClose();
    setResetForm({ password: "" });
    setResetOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await adminApi.updateUser(selectedUser.id, form);
        showSnackbar("User updated successfully", "success");
      } else {
        await adminApi.createUser(form);
        showSnackbar("User created successfully", "success");
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to save user", "error");
    }
  };

  const handleToggleStatus = async () => {
    const userToToggle = menuUser;
    handleMenuClose();
    try {
      const res = await adminApi.toggleUserStatus(userToToggle.id);
      showSnackbar(res.message, "success");
      fetchData();
    } catch (err) {
      showSnackbar("Failed to toggle status", "error");
    }
  };

  const handleResetPassword = async () => {
    try {
      await adminApi.resetUserPassword(selectedUser.id, resetForm.password);
      showSnackbar("Password reset successfully", "success");
      setResetOpen(false);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  const filteredTeams = form.departmentId 
    ? teams.filter(t => t.departmentId === form.departmentId) 
    : teams;

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150, renderCell: (params) => <Typography fontWeight={600}>{params.value}</Typography> },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 1, minWidth: 120, renderCell: (params) => <Chip size="small" label={params.row.role?.name || "Viewer"} color="primary" variant="outlined" /> },
    { field: "department", headerName: "Department", flex: 1, minWidth: 150, valueGetter: (value, row) => row.department?.name || "—" },
    { field: "team", headerName: "Team", flex: 1, minWidth: 150, valueGetter: (value, row) => row.team?.name || "—" },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120, renderCell: (params) => <Chip size="small" label={params.row.isActive ? "Active" : "Disabled"} color={params.row.isActive ? "success" : "error"} /> },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <IconButton size="small" onClick={(e) => handleMenuClick(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];


  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 600 }}>
          <DataGrid
            rows={users}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </Paper>
      )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOpenForm(menuUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem onClick={handleOpenReset}>
          <LockResetIcon fontSize="small" sx={{ mr: 1 }} /> Reset Password
        </MenuItem>
        <MenuItem onClick={handleToggleStatus} sx={{ color: menuUser?.isActive ? "error.main" : "success.main" }}>
          {menuUser?.isActive ? (
            <><BlockIcon fontSize="small" sx={{ mr: 1 }} /> Disable User</>
          ) : (
            <><CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Enable User</>
          )}
        </MenuItem>
      </Menu>

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required disabled={!!selectedUser} />
            
            {!selectedUser && (
              <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
            )}

            <TextField select label="Role" name="roleId" value={form.roleId} onChange={handleChange} fullWidth required>
              {roles.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>

            <TextField select label="Department" name="departmentId" value={form.departmentId} onChange={handleChange} fullWidth>
              <MenuItem value=""><em>None</em></MenuItem>
              {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </TextField>

            <TextField select label="Team" name="teamId" value={form.teamId} onChange={handleChange} fullWidth disabled={!form.departmentId}>
              <MenuItem value=""><em>None</em></MenuItem>
              {filteredTeams.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name || !form.email || (!selectedUser && !form.password) || !form.roleId}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
            Resetting password for <strong>{selectedUser?.name}</strong>.
          </Typography>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={resetForm.password}
            onChange={(e) => setResetForm({ password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="warning" disabled={resetForm.password.length < 6}>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
