import { Badge } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useSocketContext } from '../contexts/SocketContext';
import { postRequest } from '../postRequest';
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
  const { setChatId, chatId } = useChatContext();
  const { socket } = useSocketContext();
  const { notifications } = useNotificationContext();

  const getChats = useCallback(async () => {
    if (!user) return;

    const data: { chats: Array<any> } = await postRequest('/chat/chats', {
      id: user.id
    });

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
    if (chatId) {
      const active = conversations.find(c => c.id === chatId);
      if (!active) return;
      setChatId(active.id);
    }
  }, [chatId, conversations, setChatId]);

  useEffect(() => {
    getChats();
  }, [getChats, chatId]);

  useEffect(() => {
    updateChat();
  }, [conversations, updateChat]);

  const selectChat = async (key: number) => {
    if (chatId) {
      socket.emit('leave', chatId);
    }
    await postRequest('/chat/setopen', {
      username: user?.username,
      chatId: conversations[key].id
    });
    setChatId(conversations[key].id);
  };

  useEffect(() => {
    socket.emit('join', chatId);
  }, [chatId, socket]);

  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column' }}>
      <h1>Conversations:</h1>
      {conversations &&
        conversations.map((conversation, index) => (
          <Badge
            key={index}
            badgeContent={
              (notifications.find(not => not.name === 'Chat') as any).chats
                .length
                ? (notifications.find(
                    not => not.name === 'Chat'
                  ) as any).chats.find(
                    (chat: { id: string }) => chat.id === conversation.id
                  ).amount
                : 0 // This is so messy
            }
            color="secondary">
            <ConversationWrapper
              onClick={() => selectChat(index)}
              active={conversation.id === chatId}>
              <p>{conversation.participants?.join(', ')}</p>
            </ConversationWrapper>
          </Badge>
        ))}
      <FlexFiller />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <FlexFiller />
        <Plus onClick={_ => setModalOpen(true)} />
      </div>
      <CreateChat
        open={modalOpen}
        setOpen={setModalOpen}
        refreshChats={getChats}
      />
    </div>
  );
};
