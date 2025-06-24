import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Theme
import { AuthProvider } from './utils/auth';
import theme from './theme';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
