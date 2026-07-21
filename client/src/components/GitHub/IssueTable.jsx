import { Box, Paper, Typography, Link, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function IssueTable({ issues, loading }) {
  const columns = [
    { 
      field: "number", 
      headerName: "Issue #", 
      width: 100,
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
        if (params.value === "open") color = "warning";
        else if (params.value === "closed") color = "success";
        
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
      field: "labels", 
      headerName: "Labels", 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', pt: 1 }}>
          {params.value.map(label => (
            <Chip key={label} label={label} size="small" />
          ))}
        </Box>
      )
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Open Issues
      </Typography>
      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 400 }}>
        <DataGrid
          rows={issues}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{ noRowsLabel: 'No issues found' }}
        />
      </Paper>
    </Box>
  );
}
