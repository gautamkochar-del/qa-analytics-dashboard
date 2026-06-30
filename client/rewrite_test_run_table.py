import re

def process_file():
    with open("src/components/TestRuns/TestRunTable.jsx", "r") as f:
        content = f.read()

    # Imports
    new_imports = """import React from "react";
import { IconButton, Chip, Typography, Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";"""
    
    # We replace from import React up to const TestRunTable
    content = re.sub(r'import React from "react";.*?const TestRunTable =', new_imports + '\n\nconst TestRunTable =', content, flags=re.DOTALL)

    # Change component props
    old_props = """const TestRunTable = ({
  testRuns = [], onEdit, onDelete, sortBy, sortOrder, onSort, }) => {"""
    new_props = """const TestRunTable = ({
  testRuns = [], onEdit, onDelete, sortBy, sortOrder, onSort, page, limit, total, onPageChange, onLimitChange, loading }) => {"""
    content = content.replace(old_props, new_props)

    # Format Duration
    # Keep formatDuration as is

    # Columns
    columns_code = """
  const columns = [
    { field: "suiteName", headerName: "Suite Name", flex: 1, minWidth: 150, renderCell: (params) => <Typography fontWeight={600}>{params.value || "-"}</Typography>, sortable: true },
    { field: "project", headerName: "Project", flex: 1, minWidth: 150, valueGetter: (value, row) => row.project?.name || row.project || "-", sortable: false },
    { field: "environment", headerName: "Environment", flex: 1, minWidth: 120, renderCell: (params) => <Chip label={params.value || "-"} size="small" variant="outlined" />, sortable: false },
    { 
      field: "status", headerName: "Status", flex: 1, minWidth: 120, sortable: true,
      renderCell: (params) => {
        const status = params.value || "-";
        return (
          <Chip
            label={status.toUpperCase()}
            size="small"
            color={status === "passed" ? "success" : status === "running" ? "primary" : status === "failed" ? "error" : "default"}
          />
        );
      }
    },
    { field: "total", headerName: "Total", width: 100, sortable: true, valueGetter: (value) => value ?? "-" },
    { field: "passed", headerName: "Passed", width: 100, sortable: true, renderCell: (params) => <Chip label={params.value ?? 0} size="small" color="success" variant="outlined" /> },
    { field: "failed", headerName: "Failed", width: 100, sortable: true, renderCell: (params) => <Chip label={params.value ?? 0} size="small" color={params.value > 0 ? "error" : "default"} variant={params.value > 0 ? "filled" : "outlined"} /> },
    { field: "duration", headerName: "Duration", width: 120, sortable: true, valueGetter: (value) => formatDuration(value) },
    { 
      field: "executionDate", headerName: "Execution Date", width: 180, sortable: true,
      renderCell: (params) => {
        if (!params.value) return "-";
        return (
          <>
            {new Date(params.value).toLocaleDateString()}
            <br />
            <Typography variant="caption" color="text.secondary">
              {new Date(params.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </>
        );
      }
    },
    {
      field: "actions", headerName: "Actions", width: 120, sortable: false, align: "right", headerAlign: "right",
      renderCell: (params) => (
        <>
          <IconButton color="primary" size="small" onClick={() => onEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          {canDelete && (
            <IconButton color="error" size="small" sx={{ ml: 1 }} onClick={() => onDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </>
      )
    }
  ];
"""
    content = re.sub(r'const columns = \[.*?\];', columns_code, content, flags=re.DOTALL)

    # Change return
    return_stmt = """  return (
    <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 700 }}>
      <DataGrid
        rows={testRuns}
        columns={columns}
        disableRowSelectionOnClick
        loading={loading}
        rowCount={total}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode="server"
        paginationModel={{ page: page - 1, pageSize: limit }}
        onPaginationModelChange={(model) => {
          if (model.page + 1 !== page && onPageChange) onPageChange(null, model.page);
          if (model.pageSize !== limit && onLimitChange) onLimitChange({ target: { value: model.pageSize }});
        }}
        sortingMode="server"
        sortModel={sortBy ? [{ field: sortBy, sort: sortOrder }] : []}
        onSortModelChange={(model) => {
          if (model.length > 0) {
            onSort(model[0].field, model[0].sort);
          } else {
            onSort('executionDate', 'desc');
          }
        }}
        localeText={{ noRowsLabel: 'No Test Runs Found' }}
      />
    </Paper>
  );
"""
    content = re.sub(r'return \(\s*<TableContainer.*?</TableContainer>\s*\);', return_stmt, content, flags=re.DOTALL)

    # Clean up handleSort and columns definition - actually they might conflict or have duplicate code, but the regex should catch it.
    # Wait, the handleSort was left in. Let's just remove it since it's not used (DataGrid uses onSort directly inside onSortModelChange).
    content = re.sub(r'const handleSort = \(columnId\) => \{.*?^\s*};\s*', '', content, flags=re.DOTALL | re.MULTILINE)

    with open("src/components/TestRuns/TestRunTable.jsx", "w") as f:
        f.write(content)

process_file()
