import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
          QA Analytics Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
