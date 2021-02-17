import React from 'react';
import './App.css';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';
// Packages
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
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
