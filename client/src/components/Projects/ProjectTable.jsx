import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Chip, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = (onEdit, onDelete) => [
  {
    field: "name", headerName: "Project Name", flex: 1, minWidth: 250, }, {
    field: "status", headerName: "Status", width: 120, renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === "Active" ? "success" : "default"}
        size="small"
      />
    ), }, {
    field: "createdAt", headerName: "Created", width: 150, valueFormatter: (value) =>
      new Date(value).toLocaleDateString(), }, {
    field: "actions", headerName: "Actions", width: 120, sortable: false, renderCell: (params) => (
      <>
        <IconButton
          color="primary"
          onClick={() => onEdit(params.row)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="error"
          onClick={() => onDelete(params.row)}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ), }, ];

export default function ProjectTable({
  projects, onEdit, onDelete, }) {
  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={projects}
        columns={columns(onEdit, onDelete)}
        pageSizeOptions={[5, 10]}
        onRowClick={(params) => onEdit(params.row)}
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </Paper>
  );
}
