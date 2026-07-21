import { Box, Paper, Typography, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function CommitList({ commits, loading }) {
  const columns = [
    { 
      field: "sha", 
      headerName: "SHA", 
      width: 100, 
      renderCell: (params) => (
        <Link href={params.row.url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
          {params.value.substring(0, 7)}
        </Link>
      )
    },
    { field: "message", headerName: "Commit Message", flex: 1, minWidth: 250 },
    { field: "author", headerName: "Author", width: 150 },
    { 
      field: "date", 
      headerName: "Date", 
      width: 180,
      valueGetter: (value) => new Date(value).toLocaleString()
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Recent Commits
      </Typography>
      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 400 }}>
        <DataGrid
          rows={commits}
          columns={columns}
          getRowId={(row) => row.sha}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{ noRowsLabel: 'No commits found' }}
        />
      </Paper>
    </Box>
  );
}
