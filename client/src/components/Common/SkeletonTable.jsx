import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from "@mui/material";

export default function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <TableContainer component={Paper} sx={{ width: "100%", mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: cols }).map((_, idx) => (
              <TableCell key={idx}>
                <Skeleton variant="text" width="60%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: cols }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton variant="text" width="80%" height={20} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
