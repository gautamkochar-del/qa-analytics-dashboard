import {
  Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Divider, } from "@mui/material";

export default function RecentTestRuns({
  runs, }) {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
        >
          Recent Test Runs
        </Typography>

        <List>
          {runs.map((run, index) => (
            <div key={run.id}>
              <ListItem>
                <ListItemText
                  primary={run.project}
                  secondary={new Date(
                    run.executionDate
                  ).toLocaleString()}
                />

                <Chip
                  color={
                    run.passRate >= 90
                      ? "success"
                      : run.passRate >= 70
                      ? "warning"
                      : "error"
                  }
                  label={`${run.passRate}%`}
                />
              </ListItem>

              {index < runs.length - 1 && (
                <Divider />
              )}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
