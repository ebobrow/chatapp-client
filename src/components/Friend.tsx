import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { postRequest } from '../api';
import { friend } from '../types';
import { FriendContainer, Plus } from './styled/Friends';
import { useUser } from '../hooks/useUser';

interface Props {
  friend: friend;
}

export const Friend: React.FC<Props> = ({ friend }) => {
  const { userToken } = useAuthContext();
  const { data: user } = useUser(userToken);
  const { setChatId } = useChatContext();
  let history = useHistory();

  const addChat = async () => {
    const chat = await postRequest('/chat/createchat', {
      users: [friend.username, user?.username]
    });
    setChatId(chat.id);
    history.push('/chat');
  };

  return (
    <FriendContainer>
      <strong>{friend.name}</strong>
      <small>{friend.username}</small>
      <Button color="primary" variant="outlined" onClick={addChat}>
        Chat <Plus />
      </Button>
    </FriendContainer>
  );
};
