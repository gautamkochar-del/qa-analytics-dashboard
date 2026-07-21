import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RecentRuns({
  runs, }) {
  const navigate = useNavigate();

  // Show only latest 5
  const displayRuns = runs?.slice(0, 5) || [];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Recent Test Runs
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Suite</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRuns.map((run) => (
                <TableRow 
                  key={run.id} 
                  hover 
                  onClick={() => navigate(`/test-runs/${run.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {run.project || "Smoke Tests"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(run.executionDate).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={
                        run.passRate >= 90
                          ? "success"
                          : run.passRate >= 70
                          ? "warning"
                          : "error"
                      }
                      label={run.passRate >= 90 ? "Passed" : "Failed"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      35m
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
