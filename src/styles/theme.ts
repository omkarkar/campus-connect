import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    teams: {
      primary: string;
      secondary: string;
      background: string;
      sidebar: string;
      hover: string;
      border: string;
      text: {
        primary: string;
        secondary: string;
      };
    };
  }
  interface PaletteOptions {
    teams?: {
      primary: string;
      secondary: string;
      background: string;
      sidebar: string;
      hover: string;
      border: string;
      text: {
        primary: string;
        secondary: string;
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#464EB8', // Teams primary purple
      light: '#5B64C3',
      dark: '#363CA5',
    },
    secondary: {
      main: '#616161',
      light: '#757575',
      dark: '#424242',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    teams: {
      primary: '#464EB8',
      secondary: '#616161',
      background: '#F5F5F5',
      sidebar: '#2F3136',
      hover: '#F0F0F0',
      border: '#E0E0E0',
      text: {
        primary: '#252525',
        secondary: '#616161',
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          padding: '6px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2F3136',
          color: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
  },
});

export default theme;
