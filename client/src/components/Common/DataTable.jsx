import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export default function DataTable({ rows, columns }) {
  return (
    <Paper elevation={3}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5, }, }, }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
