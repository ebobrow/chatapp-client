import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Router } from './components/Router';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';
import { ChatContext } from './contexts/ChatContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: SECONDARY_COLOR
    }
  }
});

const App: React.FC<{}> = () => {
  return (
    <div className="App">
      <AuthContext>
        <ChatContext>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Navbar />

              <Router />
            </BrowserRouter>
          </ThemeProvider>
        </ChatContext>
      </AuthContext>
    </div>
  );
};

export default App;
