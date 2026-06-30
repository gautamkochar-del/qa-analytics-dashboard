import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Chip, CircularProgress, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/audit-logs");
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "Admin") {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role !== "Admin") {


    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied. Admins only.
        </Typography>
      </Box>
    );
  }
  const columns = [
    { field: "id", headerName: "ID", width: 80, sortable: false },
    { field: "action", headerName: "Action", width: 200, sortable: false, renderCell: (params) => {
      const action = params.value;
      let color = "default";
      if (action.includes("CREATE") || action.includes("ADD")) color = "success";
      else if (action.includes("UPDATE") || action.includes("EDIT")) color = "info";
      else if (action.includes("DELETE") || action.includes("REMOVE")) color = "error";
      else if (action.includes("LOGIN") || action.includes("LOGOUT")) color = "secondary";
      return <Chip label={action} size="small" color={color} variant="outlined" />;
    }},
    { field: "resource", headerName: "Resource", width: 150, sortable: false },
    { field: "resourceId", headerName: "Resource ID", width: 150, sortable: false, valueGetter: (value) => value || "N/A" },
    { field: "user", headerName: "User", flex: 1, minWidth: 150, sortable: false, valueGetter: (value, row) => row.user?.name || "System" },
    { field: "createdAt", headerName: "Timestamp", width: 200, sortable: false, valueGetter: (value) => value ? new Date(value).toLocaleString() : "-" }
  ];


  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Audit Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track system activities and data mutations.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Paper sx={{ height: 600, minWidth: 800, width: "100%", borderRadius: 2, overflow: "hidden" }} elevation={0} variant="outlined">
            <DataGrid
              rows={logs}
              columns={columns}
              disableRowSelectionOnClick
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              localeText={{ noRowsLabel: 'No Audit Logs Found' }}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
}
