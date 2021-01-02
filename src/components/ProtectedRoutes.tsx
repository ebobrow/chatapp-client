import { Badge, Button, ButtonGroup } from '@material-ui/core';
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
  const {
    notifications,
    setNotifications,
    changeNew
  } = useNotificationContext();

  const getNotifications = useCallback(async () => {
    const recievedRequests = await postRequest(
      '/auth/friends/recievedrequests',
      {
        username: user?.username
      }
    );

    changeNew(
      'Friends',
      !!recievedRequests.requests.find((req: { seen: boolean }) => !req.seen)
    );

    const unreadChats = await postRequest('/chat/getunread', {
      id: user?.id,
      username: user?.username
    });

    if (unreadChats.unread === null) {
      console.log('fffffffkfkfkv');

      setNotifications(curr =>
        curr.map(not =>
          not.name === 'Chat' ? { ...not, new: false, chats: [] } : not
        )
      );
    } else {
      setNotifications(curr =>
        curr.map(not =>
          not.name === 'Chat'
            ? {
                ...not,
                new: true,
                chats: unreadChats.unread.length > 0 ? unreadChats.unread : null
              }
            : not
        )
      );
    }
  }, [changeNew, user?.username, user?.id, setNotifications]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
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
  );
};
