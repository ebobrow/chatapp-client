import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Router } from './components/Router';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4db6ac'
    },
    secondary: {
      main: '#B55855'
    }
  }
});

const App: React.FC<{}> = () => {
  return (
    <div className="App">
      <AuthContext>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Navbar />
            <Router />
          </BrowserRouter>
        </ThemeProvider>
      </AuthContext>
    </div>
  );
};

export default App;
