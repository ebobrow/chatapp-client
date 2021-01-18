import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';
import { axiosConfig } from '../api';
import { friend } from '../types';
import { FriendContainer, Plus } from './styled/Friends';

interface Props {
  friend: friend;
}

export const Friend: React.FC<Props> = ({ friend }) => {
  const { setChatId } = useChatContext();
  let history = useHistory();

  const addChat = async () => {
    const { data: chat } = await axiosConfig.post('/chat/createchat', {
      users: friend.username
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
