import { AppBar, ButtonGroup, Button } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer, StyledLink } from './styled/Auth';
import { useAuthContext } from '../contexts/AuthContext';

const PROTECTED_ROUTES = [
  {
    url: '/chat',
    name: 'Chat'
  },
  {
    url: '/friends',
    name: 'Friends'
  }
];

export const Navbar: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          <ButtonGroup color="primary" variant="contained" disableElevation>
            <Button>
              <StyledLink to="/">Home</StyledLink>
            </Button>
            {loggedIn
              ? PROTECTED_ROUTES.map(route => (
                  <Button key={route.url}>
                    <StyledLink to={route.url}>{route.name}</StyledLink>
                  </Button>
                ))
              : ''}
          </ButtonGroup>
          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
