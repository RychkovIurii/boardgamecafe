import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#065f46', // your Tailwind green-800
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#374151', // your Tailwind gray-700
      contrastText: '#ffffff'
    }
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#8d5929'
        },
        thumb: {
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(6, 95, 70, 0.16)'
          }
        }
      }
    }
}
});
  
export default theme;
