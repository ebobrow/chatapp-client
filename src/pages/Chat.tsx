import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Conversation } from '../components/Conversation';
import { ConversationList } from '../components/ConversationList';
import { SocketContext } from '../contexts/SocketContext';
import { Title } from '../components/Title';

export const Chat: React.FC = () => {
  const { loggedIn } = useAuthContext();
  const [listOpen, setListOpen] = useState(window.innerWidth > 985);

  const closeMenu = useCallback(() => {
    setListOpen(window.innerWidth > 985);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', closeMenu);

    return () => {
      window.removeEventListener('resize', closeMenu);
    };
  }, [closeMenu]);

  return (
    <>
      <Title>Chat</Title>
      {!loggedIn && <Redirect to="/login" />}
      <SocketContext>
        <div style={{ display: 'flex', flexDirection: 'row', height: '90%' }}>
          <ConversationList
            w={listOpen ? '30%' : '5%'}
            open={listOpen}
            setOpen={setListOpen}
          />
          <Conversation w={listOpen ? '70%' : '95%'} />
        </div>
      </SocketContext>
    </>
  );
};
