import { Box, Paper, Typography, Link, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function BuildHistory({ builds, loading }) {
  const columns = [
    { 
      field: "number", 
      headerName: "Build #", 
      width: 100,
      renderCell: (params) => (
        <Link href={params.row.url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
          #{params.value}
        </Link>
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 130,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "SUCCESS") color = "success";
        else if (params.value === "FAILURE") color = "error";
        else if (params.value === "IN_PROGRESS") color = "info";
        
        return (
          <Chip 
            label={params.value || "UNKNOWN"} 
            size="small" 
            color={color} 
            variant="outlined" 
            sx={{ fontWeight: 600 }}
          />
        );
      }
    },
    { 
      field: "duration", 
      headerName: "Duration", 
      width: 130,
      valueGetter: (value) => value ? `${(value / 1000).toFixed(1)}s` : "-"
    },
    { 
      field: "timestamp", 
      headerName: "Executed At", 
      width: 180,
      flex: 1,
      valueGetter: (value) => new Date(value).toLocaleString()
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Build History
      </Typography>
      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 400 }}>
        <DataGrid
          rows={builds}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'number', sort: 'desc' }] },
          }}
          localeText={{ noRowsLabel: 'No builds found' }}
        />
      </Paper>
    </Box>
  );
}
