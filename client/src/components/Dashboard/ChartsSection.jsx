import Grid from "@mui/material/Grid";

import CardWrapper from "../Common/CardWrapper";

import TestExecutionChart from "../Charts/TestExecutionChart";
import PassFailChart from "../Charts/PassFailChart";
import BugSeverityChart from "../Charts/BugSeverityChart";
import TeamPerformanceChart from "../Charts/TeamPerformanceChart";

import useDashboard from "../../hooks/useDashboard";
import Loading from "../Common/Loading";

export default function ChartsSection() {
  const { dashboard, loading } = useDashboard();

  if (loading) return <Loading />;

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid size={{xs: 12, md: 6}}>
        <CardWrapper title="Test Execution Trend">
          <TestExecutionChart chart={dashboard.executionTrend} />
        </CardWrapper>
      </Grid>

      <Grid size={{xs: 12, md: 6}}>
        <CardWrapper title="Pass vs Fail">
          <PassFailChart chart={dashboard.passFail} />
        </CardWrapper>
      </Grid>

      <Grid size={{xs: 12, md: 6}}>
        <CardWrapper title="Bug Severity">
          <BugSeverityChart chart={dashboard.bugSeverity} />
        </CardWrapper>
      </Grid>

      <Grid size={{xs: 12, md: 6}}>
        <CardWrapper title="Team Performance">
          <TeamPerformanceChart chart={dashboard.teamPerformance} />
        </CardWrapper>
      </Grid>
    </Grid>
  );
}
