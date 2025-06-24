import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          COBAC
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{
              color: 'white',
            }}
          >
            Inicio
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/recipes')}
            startIcon={<BookIcon />}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Recetas
          </Button>

          <Tooltip title="Abrir menú">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
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
            <MenuItem onClick={() => navigate('/profile')}>
              <Typography textAlign="center">Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Cerrar Sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
