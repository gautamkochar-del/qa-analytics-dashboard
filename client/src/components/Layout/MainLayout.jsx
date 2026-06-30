import { Box, Toolbar } from "@mui/material";

import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";

const drawerWidth = 250;

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppHeader />

      <AppDrawer />

      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3, ml: `${drawerWidth}px`, }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}
