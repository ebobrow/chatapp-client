import { AppBar, ButtonGroup, Button, Badge } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer, StyledLink } from './styled/Auth';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';

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
  const { notifications } = useNotificationContext();

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
                  <Badge
                    key={route.url}
                    color="secondary"
                    variant="dot"
                    invisible={
                      !notifications.find(not => not.name === route.name)?.new
                    }>
                    <Button>
                      <StyledLink to={route.url}>{route.name}</StyledLink>
                    </Button>
                  </Badge>
                ))
              : ''}
          </ButtonGroup>
          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
