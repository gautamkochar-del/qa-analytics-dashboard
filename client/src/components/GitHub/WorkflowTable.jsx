import { useState } from "react";
import { Box, Paper, Typography, Link, Chip, Button, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function WorkflowTable({ actions, loading, triggerAction, selectedRepoFullName }) {
  const [workflowId, setWorkflowId] = useState("main.yml");
  const [isTriggering, setIsTriggering] = useState(false);

  const handleRun = async (testSuite) => {
    if (!selectedRepoFullName || !triggerAction) return;
    const [owner, repo] = selectedRepoFullName.split("/");
    if (!owner || !repo) return;

    setIsTriggering(true);
    await triggerAction(owner, repo, workflowId, "main", { test_suite: testSuite });
    setIsTriggering(false);
  };
  const columns = [
    { 
      field: "id", 
      headerName: "Run ID", 
      width: 100,
      renderCell: (params) => (
        <Link href={params.row.url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
          {params.value}
        </Link>
      )
    },
    { field: "name", headerName: "Workflow", flex: 1, minWidth: 200 },
    { field: "headBranch", headerName: "Branch", width: 150 },
    { 
      field: "status", 
      headerName: "Status", 
      width: 130,
      renderCell: (params) => {
        let color = "default";
        if (params.row.conclusion === "success") color = "success";
        else if (params.row.conclusion === "failure") color = "error";
        else if (params.value === "in_progress") color = "info";
        
        const label = params.row.conclusion ? params.row.conclusion : params.value;
        
        return (
          <Chip 
            label={label.toUpperCase()} 
            size="small" 
            color={color} 
            variant="outlined" 
          />
        );
      }
    },
    { 
      field: "createdAt", 
      headerName: "Executed At", 
      width: 180,
      valueGetter: (value) => new Date(value).toLocaleString()
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          GitHub Actions Workflows
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <TextField 
            size="small" 
            label="Workflow File" 
            value={workflowId} 
            onChange={(e) => setWorkflowId(e.target.value)} 
            sx={{ width: 150 }}
            disabled={isTriggering || loading}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {["Regression", "Smoke", "Sanity", "API Tests", "Mobile Tests"].map(suite => (
              <Button
                key={suite}
                variant="contained"
                size="small"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => handleRun(suite)}
                disabled={isTriggering || loading || !workflowId}
                sx={{ borderRadius: 2 }}
              >
                {suite}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", height: 400 }}>
        <DataGrid
          rows={actions}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            if (params.row.url) window.open(params.row.url, "_blank");
          }}
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          localeText={{ noRowsLabel: 'No workflows found' }}
        />
      </Paper>
    </Box>
  );
}
