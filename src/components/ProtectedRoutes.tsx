import { Badge, Button, ButtonGroup } from '@material-ui/core';
import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { StyledLink } from './styled/Auth';

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

export const ProtectedRoutes: React.FC = () => {
  const { loggedIn, user } = useAuthContext();
  const { data } = useNotifications(user?.username, user?.id);

  return (
    <ButtonGroup color="primary" variant="contained" disableElevation>
      <Badge>
        <Button>
          <StyledLink to="/">Home</StyledLink>
        </Button>
      </Badge>
      {loggedIn
        ? PROTECTED_ROUTES.map(route => (
            <Badge
              key={route.url}
              color="secondary"
              variant="dot"
              invisible={!data?.notifications[route.name].new}>
              <Button>
                <StyledLink to={route.url}>{route.name}</StyledLink>
              </Button>
            </Badge>
          ))
        : ''}
    </ButtonGroup>
  );
};
