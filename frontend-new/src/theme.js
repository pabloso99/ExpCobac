import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f00', // Naranja principal
      light: '#ffa726',
      dark: '#e65100',
      contrastText: '#fff',
    },
    secondary: {
      main: '#424242', // Gris oscuro para elementos secundarios
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff6f00', // Naranja para el AppBar
          color: '#fff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
