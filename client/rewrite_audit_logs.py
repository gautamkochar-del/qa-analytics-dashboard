import re

def process_file():
    with open("src/pages/AuditLogs.jsx", "r") as f:
        content = f.read()

    new_imports = """import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, InputAdornment, Alert, CircularProgress, Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { getAuditLogs } from "../api/adminApi";
import useDebounce from "../hooks/useDebounce";"""

    content = re.sub(r'import { useState, useEffect } from "react";.*?import useDebounce from "../hooks/useDebounce";', new_imports, content, flags=re.DOTALL)

    columns_code = """
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
"""
    
    return_stmt = """      {loading ? (
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
              rowCount={total}
              pageSizeOptions={[10, 25, 50]}
              paginationMode="server"
              paginationModel={{ page: page - 1, pageSize: limit }}
              onPaginationModelChange={(model) => {
                setPage(model.page + 1);
                setLimit(model.pageSize);
              }}
              sortingMode="server"
              localeText={{ noRowsLabel: 'No Audit Logs Found' }}
            />
          </Paper>
        </Box>
      )}"""

    content = re.sub(r'      \{loading \? \(\s*<Box.*?</Box>\s*\)\s*:\s*\(\s*<TableContainer.*?</TableContainer>\s*\)\s*\}', return_stmt, content, flags=re.DOTALL)
    
    # Also need to remove TablePagination since DataGrid handles it!
    content = re.sub(r'      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>.*?<Pagination.*?</Box>', '', content, flags=re.DOTALL)

    content = re.sub(r'(\s*return \()', columns_code + r'\1', content)

    with open("src/pages/AuditLogs.jsx", "w") as f:
        f.write(content)

process_file()
