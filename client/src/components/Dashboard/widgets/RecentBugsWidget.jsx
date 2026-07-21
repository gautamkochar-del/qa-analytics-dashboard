import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Box, } from "@mui/material";

export default function RecentBugsWidget({ bugs }) {
  const displayBugs = bugs?.slice(0, 5) || [];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Recent Bugs
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Bug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayBugs.map((bug) => (
                <TableRow 
                  key={bug.id} 
                  hover
                  onClick={() => alert(`Open Bug Edit Dialog for ${bug.title}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {bug.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bug.project}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={
                        bug.severity === "Critical"
                          ? "error"
                          : bug.severity === "High"
                          ? "warning"
                          : bug.severity === "Medium"
                          ? "info"
                          : "default"
                      }
                      label={bug.severity}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={bug.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                        {bug.assignee ? bug.assignee.charAt(0) : 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {bug.assignee || 'Unassigned'}
                      </Typography>
                    </Box>
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
