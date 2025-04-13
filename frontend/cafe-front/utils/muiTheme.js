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
});
  
export default theme;
