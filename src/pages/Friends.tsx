import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Friend } from '../components/Friend';
import { FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useAuthContext } from '../contexts/AuthContext';
import { postRequest } from '../postRequest';

interface Props {}

export const Friends: React.FC<Props> = () => {
  const { user, loggedIn } = useAuthContext();
  const [friends, setFriends] = useState<Array<string>>([]);

  const getFriendNames = useCallback(async () => {
    if (!user || !user.friends) return;
    const names = user.friends.map(async id => {
      const data = await postRequest('/friends/getname', { id });

      return data.name;
    });
    const friendNames = await Promise.all(names);

    setFriends(friendNames);
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
            ? friends?.map((friend, index) => <Friend name={friend} key={index} />)
            : 'No friends yet, loser'
          : 'Loading...'}
      </FriendsWrapper>
    </>
  );
};
