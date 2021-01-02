import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddFriend } from '../components/AddFriend';
import { Friend } from '../components/Friend';
import { FriendContainer, FriendsWrapper } from '../components/styled/Friends';
import { Title } from '../components/Title';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { postRequest } from '../postRequest';
import { friend } from '../types';

export const Friends: React.FC<{}> = () => {
  const { user, loggedIn } = useAuthContext();
  const { changeNew } = useNotificationContext();
  const [friends, setFriends] = useState<Array<friend>>([]);
  const [recievedRequests, setRecievedRequests] = useState<Array<string>>([]);
  const [sentRequests, setSentRequests] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const getFriendNames = useCallback(async () => {
    setLoading(true);
    if (!user || !user.friends) return;

    const data = await postRequest('/auth/friends/getnames', {
      ids: user.friends
    });

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

    await postRequest('/auth/friends/seen', {
      username: user?.username
    });
    changeNew('Friends', false);
  }, [user, changeNew]);

  const getFriendRequests = useCallback(async () => {
    if (!user) return;

    const recieved = await postRequest('/auth/friends/recievedrequests', {
      username: user?.username
    });

    setRecievedRequests(
      recieved.requests.map((request: { sender: string }) => request.sender)
    );

    const sent = await postRequest('/auth/friends/sentrequests', {
      username: user?.username
    });

    setSentRequests(
      sent.requests.map((request: { reciever: any }) => request.reciever)
    );
  }, [user]);

  const acceptRequest = async (accept: boolean, sender: string) => {
    const data = await postRequest('/auth/friends/accept', {
      accept,
      sender,
      reciever: user?.username
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

  return (
    <>
      <Title>Friends</Title>
      {!loggedIn && <Redirect to="/login" />}
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
