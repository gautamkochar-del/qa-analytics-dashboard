import {
  Paper, Typography, } from "@mui/material";

export default function WelcomeBanner() {
  return (
    <Paper
      sx={{
        mb: 4, p: 4, bgcolor: "primary.main", color: "white", }}
    >
      <Typography variant="h4">
        Welcome Gautam 👋
      </Typography>

      <Typography>
        QA Automation Dashboard
      </Typography>
    </Paper>
  );
}
