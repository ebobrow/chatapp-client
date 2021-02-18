import React from 'react';
import { useHistory } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';
import { Friend as FriendType } from '../types';
import { FriendContainer, Plus } from './styled/Friends';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { getErrorUrl } from '../api';

interface Props {
  friend: FriendType;
}

export const Friend: React.FC<Props> = ({ friend }) => {
  const { setChatId } = useChatContext();
  let history = useHistory();

  const addChat = async () => {
    try {
      const { data } = await axios.post('/chat', {
        users: [friend.username]
      });

      setChatId(data.id);
      history.push('/chat');
    } catch (error) {
      // Basically, assume all 400 errors are error: chat already exists
      // extra catch block in case it isn't (is that necessary?)
      if (error.status === 400) {
        try {
          setChatId(error.data.id);
          history.push('/chat');
        } catch {
          history.push(getErrorUrl(error));
        }
      } else {
        history.push(getErrorUrl(error));
      }
    }
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
