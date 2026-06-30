import { Grid, Card, CardContent, Skeleton } from "@mui/material";

export default function SkeletonCards({ count = 4 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid size={{xs: 12, sm: 6, md: 12 / count}} key={idx}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" width="60%" height={16} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
