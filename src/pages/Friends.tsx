import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddFriend } from '../components/AddFriend';
import { Friend } from '../components/Friend';
import { FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useAuthContext } from '../contexts/AuthContext';
import { postRequest } from '../postRequest';
import { friend } from '../types';

export const Friends: React.FC<{}> = () => {
  const { user, loggedIn } = useAuthContext();
  const [friends, setFriends] = useState<Array<friend>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const getFriendNames = useCallback(async () => {
    if (!user || !user.friends) return;

    const data = await postRequest('/auth/friends/getnames', {
      ids: user.friends
    });
    console.log(data.names);

    setFriends(
      data.names.map((friend: friend) => ({
        name: friend.name,
        email: friend.email
      }))
    );
  }, [user]);

  useEffect(() => {
    getFriendNames();
  }, [user, getFriendNames]);

  useEffect(() => {
    console.log(friends);
  }, [friends]);

  return (
    <>
      <Title>Friends</Title>
      {!loggedIn && <Redirect to="/login" />}
      <h1>Friends</h1>
      <FriendsWrapper>
        {user
          ? friends.length
            ? friends?.map((friend, index) => (
                <Friend friend={friend} key={index} />
              ))
            : 'No friends yet, loser'
          : 'Loading...'}
      </FriendsWrapper>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setModalOpen(true)}
        style={{ margin: '5px' }}
        disableElevation>
        Add friend
      </Button>
      {modalOpen && (
        <AddFriend
          open={modalOpen}
          setOpen={setModalOpen}
          setFriends={setFriends}
        />
      )}
    </>
  );
};
