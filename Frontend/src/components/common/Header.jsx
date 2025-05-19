// src/components/common/Header.jsx
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  useTheme, useMediaQuery, IconButton, Menu,
  MenuItem, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700
          }}
        >
          Goal Tracker
        </Typography>

        {currentUser ? (
          <>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/goals"
                    onClick={handleMenuClose}
                  >
                    My Goals
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/goals"
                  sx={{ mr: 2 }}
                >
                  My Goals
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {currentUser.username || currentUser.email}
                  </Typography>
                </Box>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
