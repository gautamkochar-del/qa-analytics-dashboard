import {
  Grid, Card, CardContent, Typography, } from "@mui/material";

export default function DashboardCards({ summary = {} }) {
  const cards = [
    {
      title: "Projects", value: summary.projects ?? 0, color: "#1976d2", }, {
      title: "Active Projects", value: summary.activeProjects ?? 0, color: "#2e7d32", }, {
      title: "Test Runs", value: summary.testRuns ?? 0, color: "#0288d1", }, {
      title: "Passed Tests", value: summary.passed ?? 0, color: "#43a047", }, {
      title: "Failed Tests", value: summary.failed ?? 0, color: "#ef5350", }, {
      title: "Open Bugs", value: summary.openBugs ?? 0, color: "#d32f2f", }, ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid size={{xs: 12, sm: 6, md: 4, lg: 2}} key={card.title}>
          <Card
            sx={{
              borderLeft: `6px solid ${card.color}`, height: "100%", }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1, fontWeight: "bold", }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
