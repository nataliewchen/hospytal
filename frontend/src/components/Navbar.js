import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = ['Patients', 'Doctors', 'Appointments'];
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };

  const handleLinkClick = (page) => {
    setAnchorElNav(null);
    if (page) {
      navigate(`/${page.toLowerCase()}`)
    }
  };

  const goHome = () => {
    navigate('/');
  }

  return (
    <AppBar position="static" className='bg-base' sx={{ mb: '50px'}}>
      <Container>
        <Toolbar sx={{ justifyContent: 'center'}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em'}} onClick={goHome} className='hover'>
            <LocalHospitalIcon />
            <Typography variant="h5">Hospytal</Typography>
          </Box>
          { location.pathname !== '/' ?
           <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={() => handleLinkClick(null)}
              sx={{ display: { xs: 'block', sm: 'none' } }}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={() => handleLinkClick(page)}>
                  <Typography mx='auto'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> : null }
          { location.pathname !== '/' ?
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end', gap: '1em'}}>
            {pages.map((page, i) => (
              <Button key={i}
                onClick={() => handleLinkClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box> : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
