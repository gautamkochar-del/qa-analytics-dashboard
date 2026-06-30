import {
  Drawer, Toolbar, List, ListItemButton, ListItemText, Typography, } from "@mui/material";

const drawerWidth = 250;

const menuItems = [
  "Dashboard", "Test Runs", "Bugs", "Reports", "Settings", ];

export default function AppDrawer() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth, "& .MuiDrawer-paper": {
          width: drawerWidth, boxSizing: "border-box", }, }}
    >
      <Toolbar>
        <Typography variant="h6">QA Dashboard</Typography>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item}>
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
