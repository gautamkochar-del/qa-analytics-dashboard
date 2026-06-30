import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AppHeader() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6">
          QA Analytics Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
