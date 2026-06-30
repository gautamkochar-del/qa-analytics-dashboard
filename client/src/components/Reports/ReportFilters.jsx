import {
  Card, CardContent, Grid, TextField, MenuItem, Button, } from "@mui/material";

export default function ReportFilters({
  projects = [], filters, onChange, onReset, }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 3}}>
            <TextField
              select
              fullWidth
              label="Project"
              value={filters.project}
              onChange={(e) =>
                onChange("project", e.target.value)
              }
            >
              <MenuItem value="">
                All Projects
              </MenuItem>

              {projects.map((project) => (
                <MenuItem
		  key={project.id}
		  value={project.project}
		>
		  {project.project}
		</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{xs: 12, md: 2}}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status}
              onChange={(e) =>
                onChange("status", e.target.value)
              }
            >
              <MenuItem value="">
                All
              </MenuItem>

              <MenuItem value="Passed">
                Passed
              </MenuItem>

              <MenuItem value="Failed">
                Failed
              </MenuItem>
            </TextField>
          </Grid>

          <Grid size={{xs: 12, md: 2}}>
            <TextField
              type="date"
              fullWidth
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.from}
              onChange={(e) =>
                onChange("from", e.target.value)
              }
            />
          </Grid>

          <Grid size={{xs: 12, md: 2}}>
            <TextField
              type="date"
              fullWidth
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.to}
              onChange={(e) =>
                onChange("to", e.target.value)
              }
            />
          </Grid>

          <Grid size={{xs: 12, md: 2}}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ height: "56px" }}
              onClick={onReset}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
