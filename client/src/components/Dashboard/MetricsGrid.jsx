import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import StatCard from "./StatCard";
import Loading from "../Common/Loading";
import { getDashboardData } from "../../services/dashboardService";

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await getDashboardData();
      setMetrics(data.metrics);
    }

    loadMetrics();
  }, []);

  if (!metrics) {
    return <Loading />;
  }

  const cards = [
    {
      title: "Total Tests", value: metrics.totalTests, color: "#2563eb", }, {
      title: "Passed", value: metrics.passed, color: "#22c55e", }, {
      title: "Failed", value: metrics.failed, color: "#ef4444", }, {
      title: "Open Bugs", value: metrics.openBugs, color: "#f59e0b", }, ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{xs: 12, sm: 6, md: 3}} key={card.title}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
