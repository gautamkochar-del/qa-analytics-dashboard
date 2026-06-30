import { Card, CardContent, Typography } from "@mui/material";

export default function CardWrapper({ title, children }) {
  return (
    <Card elevation={3}>
      <CardContent>
        {title && (
          <Typography
            variant="h6"
            gutterBottom
          >
            {title}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
