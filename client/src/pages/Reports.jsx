import {
  Typography, CircularProgress, Alert, Grid, Box, IconButton, Button, } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ScheduleIcon from "@mui/icons-material/Schedule";

import useReports from "../hooks/useReports";

import SummaryCards from "../components/Reports/SummaryCards";
import ReportActions from "../components/Reports/ReportActions";
import PassFailChart from "../components/Reports/PassFailChart";
import BugSeverityChart from "../components/Reports/BugSeverityChart";
import ExecutionTrendChart from "../components/Reports/ExecutionTrendChart";
import BugTrendChart from "../components/Reports/BugTrendChart";
import ProjectSummaryTable from "../components/Reports/ProjectSummaryTable";
import ReportFilters from "../components/Reports/ReportFilters";
import ScheduleReportDialog from "../components/Reports/ScheduleReportDialog";
import { useState } from "react";

export default function Reports() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const {
    summary, chartData, severityData, projectSummary, filteredProjectSummary, filteredExecutionTrend, filteredBugTrend, filters, updateFilter, resetFilters, loading, error, refreshReports, } = useReports();
  
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, m: 0 }}>
          Reports Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ScheduleIcon />}
            onClick={() => setScheduleOpen(true)}
          >
            Schedule
          </Button>
          <IconButton onClick={refreshReports} title="Refresh Reports">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      <ScheduleReportDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      
      <ReportFilters
        projects={projectSummary}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      <ReportActions
        summary={summary}
        projects={filteredProjectSummary}
      />

      <SummaryCards summary={summary} />

      {/* Row 1 */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <PassFailChart data={chartData} />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <BugSeverityChart data={severityData} />
        </Grid>
      </Grid>

      {/* Row 2 */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <ExecutionTrendChart data={filteredExecutionTrend} />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <BugTrendChart data={filteredBugTrend} />
        </Grid>
      </Grid>

      {/* Project Summary */}
      <Grid container sx={{ mt: 2 }}>
        <Grid size={12}>
          <ProjectSummaryTable projects={filteredProjectSummary} />
        </Grid>
      </Grid>
    </>
  );
}
