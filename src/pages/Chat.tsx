import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Conversation } from '../components/Conversation';
import { ConversationList } from '../components/ConversationList';
import { ChatContext } from '../contexts/ChatContext';
import { SocketContext } from '../contexts/SocketContext';

export const Chat: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <ChatContext>
      <SocketContext>
        <div style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
          {!loggedIn && <Redirect to="/login" />}

          <ConversationList w="30%" />
          <Conversation w="70%" />
        </div>
      </SocketContext>
    </ChatContext>
  );
};
