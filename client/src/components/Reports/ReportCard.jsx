import {
  Card, CardContent, Typography, } from "@mui/material";

export default function ReportCard({
  title, value, }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{ mt: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
