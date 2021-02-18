import Badge from '@material-ui/core/Badge';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { StyledLink } from './styled/Auth';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';

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

const ProtectedRoutes: React.FC = () => {
  const history = useHistory();
  const { data, error } = useNotifications();

  if (error) {
    history.push(getErrorUrl(error));
  }

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

export default ProtectedRoutes;
