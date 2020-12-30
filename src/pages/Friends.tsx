import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Friend } from '../components/Friend';
import { Title } from '../components/Title';
import { API_URL } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';

interface Props {}

export const Friends: React.FC<Props> = () => {
  const { user, loggedIn } = useAuthContext();
  const [friends, setFriends] = useState<Array<string>>([]);

  const getFriendNames = useCallback(async () => {
    if (!user || !user.friends) return;
    const names = user.friends.map(async id => {
      const res = await fetch(`${API_URL}/friends/getname`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {user
          ? friends.length
            ? friends?.map((friend, index) => <Friend name={friend} key={index} />)
            : 'No friends yet, loser'
          : 'Loading...'}
      </div>
    </>
  );
};
