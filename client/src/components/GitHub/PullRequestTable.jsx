import { Box, Paper, Typography, Link, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function PullRequestTable({ pullRequests, loading }) {
  const columns = [
    { 
      field: "number", 
      headerName: "PR #", 
      width: 90,
      renderCell: (params) => (
        <Link href={params.row.url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
          #{params.value}
        </Link>
      )
    },
    { field: "title", headerName: "Title", flex: 1, minWidth: 250 },
    { field: "author", headerName: "Author", width: 150 },
    { 
      field: "state", 
      headerName: "State", 
      width: 120,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "open") color = "success";
        else if (params.value === "closed") color = "error";
        
        return (
          <Chip 
            label={params.value.toUpperCase()} 
            size="small" 
            color={color} 
            variant="outlined" 
          />
        );
      }
    },
    { 
      field: "updatedAt", 
      headerName: "Last Updated", 
      width: 180,
      valueGetter: (value) => new Date(value).toLocaleString()
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Pull Requests
      </Typography>
      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 400 }}>
        <DataGrid
          rows={pullRequests}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{ noRowsLabel: 'No pull requests found' }}
        />
      </Paper>
    </Box>
  );
}
