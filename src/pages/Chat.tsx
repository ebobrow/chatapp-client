import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { Conversation } from '../components/Conversation';
import { ConversationList } from '../components/ConversationList';

const socket = io(API_URL);

export const Chat: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
      {!loggedIn && <Redirect to="/login" />}

      <ConversationList />
      <Conversation socket={socket} />
    </div>
  );
};
