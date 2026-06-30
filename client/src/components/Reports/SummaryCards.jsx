import {
  Grid, } from "@mui/material";

import ReportCard from "./ReportCard";

export default function SummaryCards({
  summary, }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{xs: 12, md: 3}}>
        <ReportCard
          title="Projects"
          value={summary.totalProjects}
        />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <ReportCard
          title="Test Runs"
          value={summary.totalTestRuns}
        />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <ReportCard
          title="Passed Tests"
          value={summary.passed}
        />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <ReportCard
          title="Open Bugs"
          value={summary.openBugs}
        />
      </Grid>
    </Grid>
  );
}
