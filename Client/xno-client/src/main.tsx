import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
const theme = createTheme({
  typography: {
    fontFamily: '"Oswald", sans-serif', 
    h1: { fontFamily: '"Oswald", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Oswald", sans-serif', fontWeight: 500 },
    h3: { fontFamily: '"Oswald", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Oswald", sans-serif', fontWeight: 200 },
    h5: { fontFamily: '"Oswald", sans-serif', fontWeight: 200 },
    h6: { fontFamily: '"Oswald", sans-serif', fontWeight: 300 }
  },

    components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 300,
          fontSize: '1.4rem'
        }
      }
    },

    MuiFab: {
      styleOverrides: {
        root: {
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 400,
          letterSpacing: 1
        }
      }
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 300
        }
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </BrowserRouter>
    
    
  </StrictMode>,
)
