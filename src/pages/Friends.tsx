import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Friend } from '../components/Friend';
import { FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useAuthContext } from '../contexts/AuthContext';
import { postRequest } from '../postRequest';
import { friend } from '../types';

export const Friends: React.FC<{}> = () => {
  const { user, loggedIn } = useAuthContext();
  const [friends, setFriends] = useState<Array<friend>>([]);

  const getFriendNames = useCallback(async () => {
    if (!user || !user.friends) return;
    const data = await postRequest('/friends/getnames', { ids: user.friends });

    setFriends(
      data.names.map((friend: friend) => ({ name: friend.name, email: friend.email }))
    );
  }, [user]);

  useEffect(() => {
    getFriendNames();
  }, [user, getFriendNames]);

  return (
    <>
      <Title>Friends</Title>
      {!loggedIn && <Redirect to="/login" />}
      <h1>Friends</h1>
      <FriendsWrapper>
        {user
          ? friends.length
            ? friends?.map((friend, index) => <Friend friend={friend} key={index} />)
            : 'No friends yet, loser'
          : 'Loading...'}
      </FriendsWrapper>
    </>
  );
};