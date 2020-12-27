import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

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
          <BrowserRouter></BrowserRouter>
        </ThemeProvider>
      </AuthContext>
    </div>
  );
};

export default App;
