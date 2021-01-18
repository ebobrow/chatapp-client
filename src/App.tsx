import React from 'react';
import './App.css';
// Packages
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HelmetProvider } from 'react-helmet-async';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';
// Components
import { Navbar } from './components/Navbar';
import { Router } from './components/Router';
// Contexts
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

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <div className="App">
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ChatContext>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <Navbar />

                <Router />
              </BrowserRouter>
            </ThemeProvider>
          </ChatContext>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </HelmetProvider>
    </div>
  );
};

export default App;
