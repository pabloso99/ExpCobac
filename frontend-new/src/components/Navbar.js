import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { authService } from '../services/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Expand as ExplosionIcon,
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Diagnostic log to inspect auth state
  console.log('[Navbar] User state:', { user, isAdmin });
  
  // Use the role from the user object directly if available
  const hasAdminRole = user?.role === 'admin';
  console.log('[Navbar] hasAdminRole:', hasAdminRole);
  
  const theme = useTheme();

  // Diagnostic log to inspect auth state in Navbar
  console.log('[Navbar] Rendering with auth state:', { user, isAdmin, hasAdminRole });
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: theme.palette.primary.main,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              COBAC
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate('/recipes')}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <BookIcon sx={{ mr: 1 }} />
              Recetas
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/explocion')}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ExplosionIcon sx={{ mr: 1, fontSize: 24 }} />
              Explocion
            </Button>
            {hasAdminRole && (
              <Button
                variant="text"
                onClick={() => navigate('/admin/users')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <AdminIcon sx={{ mr: 1 }} />
                Administrar
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Abrir menú">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={() => {
            handleCloseUserMenu();
            navigate('/profile');
          }}>
            <PersonIcon sx={{ mr: 1 }} />
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <PersonIcon sx={{ mr: 1 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
