import React from 'react';
import './App.css';
// Packages
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';
// Components
import { Navbar } from './components/Navbar';
import { Router } from './components/Router';
// Contexts
import { AuthContext } from './contexts/AuthContext';
import { ChatContext } from './contexts/ChatContext';
import { NotificationContext } from './contexts/NotificationContext';

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

const queryClient = new QueryClient();

const App: React.FC<{}> = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <ChatContext>
            <NotificationContext>
              <ThemeProvider theme={theme}>
                <BrowserRouter>
                  <Navbar />

                  <Router />
                </BrowserRouter>
              </ThemeProvider>
            </NotificationContext>
          </ChatContext>
        </AuthContext>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
};

export default App;
