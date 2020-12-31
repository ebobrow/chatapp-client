import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Conversation } from '../components/Conversation';
import { ConversationList } from '../components/ConversationList';
import { SocketContext } from '../contexts/SocketContext';
import { Title } from '../components/Title';

export const Chat: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <>
      <Title>Chat</Title>
      {!loggedIn && <Redirect to="/login" />}
      <SocketContext>
        <div style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
          <ConversationList w="30%" />
          <Conversation w="70%" />
        </div>
      </SocketContext>
    </>
  );
};
