import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
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
import { Loading } from '../components/Loading';
import Button from '@material-ui/core/Button';

const Friends: React.FC = () => {
  const history = useHistory();
  const { data: user, isLoading: userLoading, isError: userError } = useUser();
  const {
    data: friends,
    isLoading: friendsLoading,
    refetch: refetchFriends,
    isError: friendsError
  } = useFriends();
  const { refetch } = useNotifications();
  const {
    data: recievedRequests,
    refetch: refetchRecieved,
    isError: requestsError
  } = useRecievedRequests();
  const { data: sentRequests } = useSentRequests();
  const [modalOpen, setModalOpen] = useState(false);

  const clearNotifications = useCallback(async () => {
    if (!user) return;

    await axios.put('/auth/friends/seen');
    refetch();
  }, [user, refetch]);

  const acceptRequest = async (accept: boolean, sender: string) => {
    await axios.put('/auth/friends/accept', {
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

  if (userLoading || friendsLoading) {
    return <Loading />;
  }

  if (!user) {
    history.push('/login');
  }

  if (friendsError || requestsError || userError) {
    history.push('/error');
  }

  return (
    <>
      <Title>Friends</Title>
      <h1>Friends</h1>
      <FriendsWrapper>
        {friends?.length
          ? friends?.map((friend, index) => (
              <Friend friend={friend} key={index} />
            ))
          : 'No friends yet, loser'}
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
            {recievedRequests && recievedRequests.length
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
            {sentRequests && sentRequests.length
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
      {modalOpen && <AddFriend open={modalOpen} setOpen={setModalOpen} />}
    </>
  );
};

export default Friends;
