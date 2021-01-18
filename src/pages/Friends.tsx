import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddFriend } from '../components/AddFriend';
import { Friend } from '../components/Friend';
import { FriendContainer, FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useNotifications } from '../hooks/useNotifications';
import { friend } from '../types';
import { useUser } from '../hooks/useUser';
import axios from 'axios';

export const Friends: React.FC = () => {
  const { data: user, isLoading } = useUser();
  const { refetch } = useNotifications();
  const [friends, setFriends] = useState<Array<friend>>([]);
  const [recievedRequests, setRecievedRequests] = useState<Array<string>>([]);
  const [sentRequests, setSentRequests] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const getFriendNames = useCallback(async () => {
    if (!user || !user.user.friends) return;
    setLoading(true);

    const { data } = await axios.get('/auth/friends/getnames');

    setFriends(
      data.names.map((friend: friend) => ({
        name: friend.name,
        username: friend.username
      }))
    );
    setLoading(false);
  }, [user]);

  const clearNotifications = useCallback(async () => {
    if (!user) return;

    await axios.get('/auth/friends/seen');
    refetch();
    // changeNew('Friends', false);
  }, [user, refetch]);

  const getFriendRequests = useCallback(async () => {
    if (!user) return;

    const { data: recieved } = await axios.get(
      '/auth/friends/recievedrequests'
    );

    setRecievedRequests(
      recieved.requests.map((request: { sender: string }) => request.sender)
    );

    const { data: sent } = await axios.get('/auth/friends/sentrequests');

    setSentRequests(
      sent.requests.map((request: { reciever: any }) => request.reciever)
    );
  }, [user]);

  const acceptRequest = async (accept: boolean, sender: string) => {
    const { data } = await axios.post('/auth/friends/accept', {
      accept,
      sender
    });

    setRecievedRequests(curr => curr.filter(req => req !== sender));
    if (accept) {
      setFriends(curr => [...curr, { username: sender, name: data.name }]);
    }
  };

  useEffect(() => {
    getFriendNames();
    getFriendRequests();
    setTimeout(clearNotifications, 1000);
  }, [getFriendNames, getFriendRequests, clearNotifications]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Title>Friends</Title>
      {!user?.user && <Redirect to="/login" />}
      <h1>Friends</h1>
      <FriendsWrapper>
        {!loading
          ? friends.length
            ? friends?.map((friend, index) => (
                <Friend friend={friend} key={index} />
              ))
            : 'No friends yet, loser'
          : 'Loading...'}
      </FriendsWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
        <div>
          <h2>Pending requests</h2>
          <FriendsWrapper>
            {recievedRequests.length
              ? recievedRequests.map(sender => (
                  <FriendContainer key={sender}>
                    <strong>{sender}</strong>
                    <div>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ margin: 5 }}
                        onClick={() => acceptRequest(true, sender)}
                        disableElevation>
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ margin: 5 }}
                        onClick={() => acceptRequest(false, sender)}
                        disableElevation>
                        Decline
                      </Button>
                    </div>
                  </FriendContainer>
                ))
              : 'None'}
          </FriendsWrapper>
        </div>

        <div>
          <h2>Sent requests</h2>
          <FriendsWrapper>
            {sentRequests.length
              ? sentRequests.map(recipient => (
                  <FriendContainer key={recipient}>
                    <strong>{recipient}</strong>
                    <p>Pending</p>
                  </FriendContainer>
                ))
              : 'None'}
          </FriendsWrapper>
        </div>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setModalOpen(true)}
        style={{ margin: '5px' }}
        disableElevation>
        Request friend
      </Button>
      {modalOpen && (
        <AddFriend
          open={modalOpen}
          setOpen={setModalOpen}
          setRequests={setSentRequests}
        />
      )}
    </>
  );
};
