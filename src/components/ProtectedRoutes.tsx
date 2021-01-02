import { Badge, Button } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { postRequest } from '../postRequest';
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

export const ProtectedRoutes: React.FC<{}> = () => {
  const { loggedIn, user } = useAuthContext();
  const { notifications, changeNew } = useNotificationContext();

  const getNotifications = useCallback(async () => {
    const recieved = await postRequest('/auth/friends/recievedrequests', {
      username: user?.username
    });

    changeNew(
      'Friends',
      !!recieved.requests.find((req: { seen: boolean }) => !req.seen)
    );
  }, [changeNew, user?.username]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <>
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
    </>
  );
};
