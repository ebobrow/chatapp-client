import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddFriend } from '../components/AddFriend';
import { Friend } from '../components/Friend';
import { FriendContainer, FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useNotifications } from '../hooks/useNotifications';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { useFriends } from '../hooks/useFriends';
import { useRecievedRequests } from '../hooks/useRecievedRequests';
import { useSentRequests } from '../hooks/useSentRequests';

export const Friends: React.FC = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const {
    data: friends,
    isLoading: friendsLoading,
    refetch: refetchFriends
  } = useFriends();
  const { refetch } = useNotifications();
  const {
    data: recievedRequests,
    refetch: refetchRecieved
  } = useRecievedRequests();
  const { data: sentRequests } = useSentRequests();
  const [modalOpen, setModalOpen] = useState(false);

  const clearNotifications = useCallback(async () => {
    if (!user) return;

    await axios.get('/auth/friends/seen');
    refetch();
  }, [user, refetch]);

  const acceptRequest = async (accept: boolean, sender: string) => {
    await axios.post('/auth/friends/accept', {
      accept,
      sender
    });

    refetchRecieved();
    if (accept) {
      refetchFriends();
    }
  };

  useEffect(() => {
    setTimeout(clearNotifications, 1000);
  }, [clearNotifications]);

  if (userLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Title>Friends</Title>
      {!user && <Redirect to="/login" />}
      <h1>Friends</h1>
      <FriendsWrapper>
        {!friendsLoading
          ? friends?.length
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
            {recievedRequests && recievedRequests.requests.length
              ? recievedRequests.requests.map((sender: any) => (
                  <FriendContainer key={sender}>
                    <strong>{sender.sender}</strong>
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
            {sentRequests && sentRequests.requests.length
              ? sentRequests.requests.map((recipient: any) => (
                  <FriendContainer key={recipient}>
                    <strong>{recipient.reciever}</strong>
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
      {modalOpen && <AddFriend open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};
