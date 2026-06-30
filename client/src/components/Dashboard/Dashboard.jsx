import PassFailChart from "../components/Dashboard/PassFailChart";
import ExecutionTrendChart from "../components/Dashboard/ExecutionTrendChart";
import BugSeverityChart from "../components/Dashboard/BugSeverityChart";

<Grid container spacing={3} mt={2}>
  <Grid size={{xs: 12, md: 6}}>
    <PassFailChart />
  </Grid>

  <Grid size={{xs: 12, md: 6}}>
    <BugSeverityChart />
  </Grid>

  <Grid size={12}>
    <ExecutionTrendChart />
  </Grid>
</Grid>
