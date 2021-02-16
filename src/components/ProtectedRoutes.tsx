import { Badge, Button, ButtonGroup } from '@material-ui/core';
import React from 'react';
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
  const { data } = useNotifications();

  return (
    <ButtonGroup color="primary" variant="contained" disableElevation>
      <Badge>
        <Button>
          <StyledLink to="/">Home</StyledLink>
        </Button>
      </Badge>
      {PROTECTED_ROUTES.map(route => (
        <Badge
          key={route.url}
          color="secondary"
          variant="dot"
          invisible={!data || !data[route.name]?.new}>
          <Button>
            <StyledLink to={route.url}>{route.name}</StyledLink>
          </Button>
        </Badge>
      ))}
    </ButtonGroup>
  );
};
