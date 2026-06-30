import {
  Stack, Button, } from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import DownloadIcon from "@mui/icons-material/Download";

import {
  exportPDF, exportExcel, exportCSV, } from "../../utils/reportExport";

export default function ReportActions({
  summary, projects, }) {
  console.log("Summary:", summary);
  console.log("Projects:", projects);
 
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ mb: 3 }}
    >
      <Button
        variant="contained"
        color="error"
        startIcon={<PictureAsPdfIcon />}
        onClick={() =>
          exportPDF(summary, projects)
        }
      >
        PDF
      </Button>

      <Button
        variant="contained"
        color="success"
        startIcon={<TableChartIcon />}
        onClick={() =>
          exportExcel(projects)
        }
      >
        Excel
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={() =>
          exportCSV(projects)
        }
      >
        CSV
      </Button>
    </Stack>
  );
}
