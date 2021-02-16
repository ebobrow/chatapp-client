import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';
import { Friend as FriendType } from '../types';
import { FriendContainer, Plus } from './styled/Friends';
import axios from 'axios';

interface Props {
  friend: FriendType;
}

export const Friend: React.FC<Props> = ({ friend }) => {
  const { setChatId } = useChatContext();
  let history = useHistory();

  const addChat = async () => {
    const { data: chat } = await axios.post('/chat/createchat', {
      users: [friend.username]
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
