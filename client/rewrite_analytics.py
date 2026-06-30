import re

def process_file():
    with open("src/pages/Analytics.jsx", "r") as f:
        content = f.read()

    new_imports = """import {
  Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button, Alert, Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";"""

    content = re.sub(r'import \{\s*Box,.*?\} from "@mui/material";', new_imports, content, flags=re.DOTALL)

    columns_code = """
  const flakyColumns = [
    { field: "suite", headerName: "Suite/Spec Name", flex: 1, minWidth: 200, renderCell: (params) => <Typography fontWeight={600}>{params.value}</Typography> },
    { field: "project", headerName: "Project", flex: 1, minWidth: 150 },
    { field: "totalRuns", headerName: "Total Runs", width: 120, align: "center", headerAlign: "center" },
    { field: "failures", headerName: "Failed Runs", width: 120, align: "center", headerAlign: "center" },
    { field: "instabilityRate", headerName: "Instability Index", width: 150, align: "center", headerAlign: "center", renderCell: (params) => (
        <Typography variant="body2" fontWeight={650} color={params.value > 50 ? "error.main" : "warning.main"}>
          {params.value}%
        </Typography>
      )
    },
    { field: "status", headerName: "Status", width: 150, align: "right", headerAlign: "right", renderCell: (params) => (
        <Chip
          label={params.row.instabilityRate > 50 ? "High Risk" : "Moderate Risk"}
          color={params.row.instabilityRate > 50 ? "error" : "warning"}
          size="small"
        />
      )
    }
  ];
"""
    
    return_stmt = """              {flaky.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">Excellent! No flaky tests detected.</Typography>
                </Box>
              ) : (
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Box sx={{ minWidth: 800, height: 400 }}>
                    <DataGrid
                      rows={flaky}
                      columns={flakyColumns}
                      getRowId={(row) => row.suite + row.project}
                      pageSizeOptions={[5, 10, 25]}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      disableRowSelectionOnClick
                    />
                  </Box>
                </Box>
              )}"""

    content = re.sub(r'              \{flaky\.length === 0 \? \(\s*<Box display="flex" justifyContent="center" alignItems="center".*?</Box>\s*\)\s*:\s*\(\s*<Table>.*?</Table>\s*\)\s*\}', return_stmt, content, flags=re.DOTALL)
    
    # insert columns_code before return (
    content = re.sub(r'(\s*return \()', columns_code + r'\1', content)

    with open("src/pages/Analytics.jsx", "w") as f:
        f.write(content)

process_file()
