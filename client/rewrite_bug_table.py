import re

def process_file():
    with open("src/components/Bugs/BugTable.jsx", "r") as f:
        content = f.read()

    new_imports = """import React from "react";
import { IconButton, Chip, Typography, Box, Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";"""

    content = re.sub(r'import React from "react";.*?const BugTable =', new_imports + '\n\nconst BugTable =', content, flags=re.DOTALL)

    old_props = """const BugTable = ({
  bugs = [], onEdit, onDelete, sortBy, sortOrder, onSort, }) => {"""
    new_props = """const BugTable = ({
  bugs = [], onEdit, onDelete, sortBy, sortOrder, onSort, page, limit, total, onPageChange, onLimitChange, loading }) => {"""
    content = content.replace(old_props, new_props)

    columns_code = """
  const columns = [
    { field: "jiraId", headerName: "Jira ID", width: 120, renderCell: (params) => {
      const jiraId = params.value;
      if (jiraId) {
        return (
          <Button
            variant="text"
            size="small"
            color="primary"
            sx={{ fontWeight: 600, minWidth: 'auto', p: 0 }}
            onClick={() => window.open(`https://jira.yourcompany.com/browse/${jiraId}`, '_blank')}
          >
            {jiraId}
          </Button>
        );
      }
      return <Typography color="text.secondary">-</Typography>;
    }, sortable: true },
    { field: "title", headerName: "Title", flex: 1, minWidth: 200, renderCell: (params) => <Typography fontWeight={500}>{params.value || "-"}</Typography>, sortable: true },
    { field: "project", headerName: "Project", flex: 1, minWidth: 150, valueGetter: (value, row) => row.project?.name || row.project || "-", sortable: false },
    { field: "severity", headerName: "Severity", width: 120, sortable: true, renderCell: (params) => {
      const severity = params.value || "-";
      return (
        <Chip
          label={severity}
          size="small"
          color={severity === 'Critical' ? 'error' : severity === 'High' ? 'warning' : severity === 'Medium' ? 'info' : 'default'}
        />
      );
    }},
    { field: "status", headerName: "Status", width: 120, sortable: true, renderCell: (params) => {
      const status = params.value || "-";
      return (
        <Chip
          label={status}
          size="small"
          variant="outlined"
          color={status === 'Open' ? 'error' : status === 'In Progress' ? 'primary' : status === 'Resolved' ? 'success' : 'default'}
        />
      );
    }},
    { field: "reportedBy", headerName: "Reported By", width: 150, sortable: true, valueGetter: (value) => value || "-" },
    { field: "createdAt", headerName: "Created At", width: 150, sortable: true, valueGetter: (value) => value ? new Date(value).toLocaleDateString() : "-" },
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

    return_stmt = """  return (
    <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 700 }}>
      <DataGrid
        rows={bugs}
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
            onSort('createdAt', 'desc');
          }
        }}
        localeText={{ noRowsLabel: 'No Bugs Found' }}
      />
    </Paper>
  );
"""
    content = re.sub(r'return \(\s*<TableContainer.*?</TableContainer>\s*\);', return_stmt, content, flags=re.DOTALL)
    content = re.sub(r'const handleSort = \(columnId\) => \{.*?^\s*};\s*', '', content, flags=re.DOTALL | re.MULTILINE)

    with open("src/components/Bugs/BugTable.jsx", "w") as f:
        f.write(content)

process_file()
