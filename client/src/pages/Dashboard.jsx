import React from 'react';
import { Box } from "@mui/material";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import HeroBanner from "../components/Dashboard/HeroBanner";
import KPICards from "../components/Dashboard/KPICards";
import DashboardGrid from "../components/Dashboard/DashboardGrid";

export default function Dashboard() {
  return (
    <Box sx={{ pb: 4 }}>
      <DashboardHeader />
      <HeroBanner />
      <KPICards />
      <DashboardGrid />
    </Box>
  );
}
