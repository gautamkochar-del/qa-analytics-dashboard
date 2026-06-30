import {
  Card, CardContent, Typography, Box, LinearProgress, Stack, } from "@mui/material";

export default function ProjectHealth({
  projects, }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
        >
          Project Health
        </Typography>

        <Stack spacing={3}>
          {projects.map((project) => (
            <Box key={project.id}>
              <Typography
                variant="subtitle2"
              >
                {project.name}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={project.passRate}
                sx={{
                  height: 10, borderRadius: 5, mt: 1, }}
              />

              <Typography
                variant="body2"
                sx={{ mt: 1 }}
              >
                {project.passRate}% Passed
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
