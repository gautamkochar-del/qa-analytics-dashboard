import re

def process_file():
    with open("src/components/Reports/ProjectSummaryTable.jsx", "r") as f:
        content = f.read()

    new_imports = """import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";"""

    content = re.sub(r'import \{.*?\} from "@mui/material";', new_imports, content, flags=re.DOTALL)

    columns_code = """
  const columns = [
    { field: "project", headerName: "Project", flex: 1, minWidth: 150 },
    { field: "totalTests", headerName: "Total Tests", width: 120, align: "center", headerAlign: "center" },
    { field: "passed", headerName: "Passed", width: 120, align: "center", headerAlign: "center" },
    { field: "failed", headerName: "Failed", width: 120, align: "center", headerAlign: "center" },
    { field: "passRate", headerName: "Pass %", width: 120, align: "center", headerAlign: "center", renderCell: (params) => (
        <Chip
          label={`${params.value}%`}
          color={params.value >= 90 ? "success" : params.value >= 70 ? "warning" : "error"}
          size="small"
        />
      )
    },
    { field: "openBugs", headerName: "Open Bugs", width: 120, align: "center", headerAlign: "center" }
  ];
"""
    
    return_stmt = """  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Summary
        </Typography>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={projects}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => row.id || row.project}
          />
        </Box>
      </CardContent>
    </Card>
  );"""

    content = re.sub(r'console\.log\(projects\);', 'console.log(projects);\n' + columns_code, content)
    content = re.sub(r'return \(\s*<Card.*?</Card>\s*\);', return_stmt, content, flags=re.DOTALL)

    with open("src/components/Reports/ProjectSummaryTable.jsx", "w") as f:
        f.write(content)

process_file()
