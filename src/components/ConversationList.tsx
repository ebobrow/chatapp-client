import { Badge } from '@material-ui/core';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useSocketContext } from '../contexts/SocketContext';
import { postRequest } from '../postRequest';
import { ChatObject } from '../types';
import { CreateChat } from './CreateChat';
import {
  ConversationListWrapper,
  ConversationWrapper,
  FlexFiller,
  Hamburger,
  Plus,
  X
} from './styled/Chat';

interface Props {
  w: string;
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const ConversationList: React.FC<Props> = ({ w, open, setOpen }) => {
  const [conversations, setConversations] = useState<Array<ChatObject>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuthContext();
  const { setChatId, chatId } = useChatContext();
  const { socket } = useSocketContext();
  const { notifications, setNotifications } = useNotificationContext();

  const getChats = useCallback(async () => {
    if (!user) return;

    const data: { chats: Array<any> } = await postRequest('/chat/chats', {
      id: user.id
    });

    setConversations(
      data.chats
        .map(chat => ({
          ...chat,
          participants: chat.participants.map((person: string) =>
            person === user.name ? 'Me' : person
          )
        }))
        .sort((a, b) => {
          const aId = a.id.substring(0, 1);
          const bId = b.id.substring(0, 1);

          return aId !== bId ? (aId > bId ? 1 : -1) : 0;
        })
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

    setTimeout(() => {
      setNotifications(curr =>
        curr.map(not =>
          not.name === 'Chat'
            ? {
                ...not,
                new: false,
                chats: not.chats.filter(
                  chat => chat.id !== conversations[key].id
                )
              }
            : not
        )
      );
    }, 1000);
    setChatId(conversations[key].id);
  };

  useEffect(() => {
    socket.emit('join', chatId);
  }, [chatId, socket]);

  return (
    <ConversationListWrapper w={w}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
        {open && <h1>Conversations:</h1>}
        {open ? (
          <X onClick={() => setOpen(false)} />
        ) : (
          <Hamburger onClick={() => setOpen(true)} />
        )}
      </div>
      {conversations &&
        open &&
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
        {open && <Plus onClick={_ => setModalOpen(true)} />}
      </div>
      <CreateChat
        open={modalOpen}
        setOpen={setModalOpen}
        refreshChats={getChats}
      />
    </ConversationListWrapper>
  );
};
