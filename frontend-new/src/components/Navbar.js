import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

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
  Person as PersonIcon,
  Book as BookIcon,
  SupervisorAccount as AdminIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, hasRole } = useAuth();

  const hasAdminRole = hasRole('admin');
  const hasChefRole = hasRole('chef');
  const hasProducRole = hasRole('produc');
  const hasComprasRole = hasRole('compras');
  const hasAlmacenRole = hasRole('almacen');


  
  const theme = useTheme();
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
            {(hasRole('user') || hasChefRole || hasAdminRole) && (
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
            )}
            {(hasComprasRole || hasAlmacenRole || hasChefRole || hasAdminRole) && (
              <Button
                variant="text"
                onClick={() => navigate('/ingredients')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ListAltIcon sx={{ mr: 1, fontSize: 24 }} />
                Ingredientes
              </Button>
            )}
            {(hasAlmacenRole || hasProducRole || hasChefRole || hasAdminRole) && (
              <Button
                variant="text"
                onClick={() => navigate('/production')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Producción
              </Button>
            )}
            {(hasComprasRole || hasChefRole || hasAdminRole) && (
              <Button
                variant="text"
                onClick={() => navigate('/costs')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Costos
              </Button>
            )}
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
