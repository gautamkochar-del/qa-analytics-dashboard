import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Paper, Grid, Button, CircularProgress, Divider, Menu, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import * as testRunApi from "../api/testRunApi";
import * as testResultApi from "../api/testResultApi";
import StatusSummary from "../components/TestResults/StatusSummary";
import TestResultSearch from "../components/TestResults/TestResultSearch";
import TestResultTable from "../components/TestResults/TestResultTable";
import TestResultDetailsPane from "../components/TestResults/TestResultDetails";

export default function TestRunDetails() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openExportMenu = Boolean(anchorEl);

  const handleExportClick = (event) => setAnchorEl(event.currentTarget);
  const handleExportClose = () => setAnchorEl(null);

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    handleExportClose();
  };

  const exportCSV = () => {
    if (!testCasesData) return;
    const header = "Test Name,Class Name,Status,Duration (sec),Error\n";
    const rows = testCasesData.map(tc => 
      `"${tc.name || ''}","${tc.className || ''}","${tc.status}","${tc.duration}","${(tc.error || '').replace(/"/g, '""')}"`
    ).join("\n");
    downloadFile(`TestRun_${id}_Export.csv`, header + rows, "text/csv");
  };

  const exportMockExcel = () => {
    exportCSV(); // Real Excel requires xlsx library, we fall back to CSV or simple TSV
  };

  const exportMockPDF = () => {
    alert("In a production environment, this would trigger a window.print() or a PDF generator service mapping the test results.");
    handleExportClose();
  };

  const { data: run, isLoading, error } = useQuery({
    queryKey: ["testRun", id],
    queryFn: () => testRunApi.getTestRun(id),
  });

  const { data: testCasesData, isLoading: isTestCasesLoading } = useQuery({
    queryKey: ["testCases", id],
    queryFn: () => testResultApi.getTestCasesForRun(id),
    enabled: !!id,
  });

  if (isLoading || isTestCasesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !run) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load Test Run details.
        </Typography>
        <Button component={RouterLink} to="/tests" sx={{ mt: 2 }}>
          Back to Test Runs
        </Button>
      </Box>
    );
  }

  const testCases = testCasesData || [];

  const filteredTestCases = testCases.filter(tc => tc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button component={RouterLink} to="/tests" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          onClick={handleExportClick}
        >
          Export Run Details
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openExportMenu}
          onClose={handleExportClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={exportMockPDF}>Export as PDF</MenuItem>
          <MenuItem onClick={exportMockExcel}>Export as Excel</MenuItem>
          <MenuItem onClick={exportCSV}>Export as CSV</MenuItem>
        </Menu>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {run.suiteName}
      </Typography>
      
      {/* Overview Section */}
      <StatusSummary run={run} />

      {/* Test Cases Section */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 5, lg: 4}}>
          <Paper sx={{ p: 2, borderRadius: 3, height: "100%", minHeight: 600 }}>
            <TestResultSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Divider sx={{ mb: 1 }} />
            <TestResultTable 
              filteredTestCases={filteredTestCases} 
              selectedTestCase={selectedTestCase} 
              setSelectedTestCase={setSelectedTestCase} 
            />
          </Paper>
        </Grid>
        
        {/* Test Case Detail View */}
        <Grid size={{xs: 12, md: 7, lg: 8}}>
          <Paper sx={{ p: 4, borderRadius: 3, height: "100%", minHeight: 600 }}>
            <TestResultDetailsPane testCase={selectedTestCase} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
