import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import {
  Typography,
} from '@mui/material';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Typography component="h1" variant="h4" align="center" gutterBottom>
      Bienvenido
    </Typography>
  );
}

export default Profile;
