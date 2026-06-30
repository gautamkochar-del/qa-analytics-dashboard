import {
  Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Divider, Stack, } from "@mui/material";

export default function RecentBugs({ bugs }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Bugs
        </Typography>

        <List>
          {bugs.map((bug, index) => (
            <div key={bug.id}>
              <ListItem>
                <ListItemText
                  primary={bug.title}
                  secondary={bug.project}
                />

                <Stack spacing={1}>
                  <Chip
                    size="small"
                    color={
                      bug.severity === "Critical"
                        ? "error"
                        : bug.severity === "High"
                        ? "warning"
                        : "info"
                    }
                    label={bug.severity}
                  />

                  <Chip
                    size="small"
                    variant="outlined"
                    label={bug.status}
                  />
                </Stack>
              </ListItem>

              {index < bugs.length - 1 && (
                <Divider />
              )}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
