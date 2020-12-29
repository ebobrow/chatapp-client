import React, { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useSocketContext } from '../contexts/SocketContext';
import { ChatObject } from '../types';
import { CreateChat } from './CreateChat';
import { ConversationWrapper, FlexFiller, Plus } from './styled/Chat';

interface Props {
  w: string;
}

export const ConversationList: React.FC<Props> = ({ w }) => {
  const [conversations, setConversations] = useState<Array<ChatObject>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuthContext();
  const { setChat, chat } = useChatContext();
  const { socket } = useSocketContext();

  const getChats = useCallback(async () => {
    if (!user) return;

    const res = await fetch(`${API_URL}/chat/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: user.id })
    });
    const data: { chats: Array<any> } = await res.json();

    setConversations(
      data.chats.map(chat => ({
        ...chat,
        participants: chat.participants.map((person: string) =>
          person === user.name ? 'Me' : person
        )
      }))
    );
  }, [setConversations, user]);

  const updateChat = useCallback(() => {
    if (chat.id) {
      const active = conversations.find(c => c.id === chat.id);
      if (!active) return;
      setChat(active);
    }
  }, [chat.id, conversations, setChat]);

  useEffect(() => {
    getChats();
  }, [getChats, chat.id]);

  useEffect(() => {
    updateChat();
  }, [conversations, updateChat]);

  const selectChat = (key: number) => {
    if (chat.id) {
      socket.emit('leave', chat.id);
    }
    setChat(conversations[key]);
  };

  useEffect(() => {
    socket.emit('join', chat.id);
  }, [chat.id, socket]);

  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column' }}>
      <h1>Conversations:</h1>
      {conversations &&
        conversations.map((conversation, index) => (
          <ConversationWrapper
            key={index}
            onClick={_ => selectChat(index)}
            active={conversation.id === chat.id}>
            <p>{conversation.participants?.join(', ')}</p>
          </ConversationWrapper>
        ))}
      <FlexFiller />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <FlexFiller />
        <Plus onClick={_ => setModalOpen(true)} />
      </div>
      <CreateChat open={modalOpen} setOpen={setModalOpen} refreshChats={getChats} />
    </div>
  );
};
