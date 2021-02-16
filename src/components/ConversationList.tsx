import { Badge } from '@material-ui/core';
import React, { Dispatch, useEffect, useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useSocketContext } from '../contexts/SocketContext';
import { useNotifications } from '../hooks/useNotifications';
import { CreateChat } from './CreateChat';
import {
  ConversationListWrapper,
  ConversationWrapper,
  FlexFiller,
  Hamburger,
  Plus,
  X
} from './styled/Chat';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { useConversations } from '../hooks/useConversations';
import { catcher } from '../api';

interface Props {
  w: string;
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const ConversationList: React.FC<Props> = ({ w, open, setOpen }) => {
  const { data: user } = useUser();
  const { data: chats, refetch: refetchConversations } = useConversations();
  const conversations = chats?.map(chat => ({
    ...chat,
    participants: chat.participants.map((person: string) =>
      person === user?.name ? 'Me' : person
    )
  }));
  const [modalOpen, setModalOpen] = useState(false);
  const { setChatId, chatId } = useChatContext();
  const { socket } = useSocketContext();
  const { data, refetch: refetchNotifications } = useNotifications();

  const selectChat = async (key: number) => {
    if (chatId) {
      socket.emit('leave', chatId);
    }

    if (!conversations) return;

    await catcher(async () => {
      await axios.post('/chat/setopen', { chatId: conversations[key].id });
    });

    setChatId(conversations[key].id);
    refetchNotifications();
    refetchConversations();
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
              (data?.Chat as any).chats.length
                ? (data?.Chat as any).chats.find(
                    (chat: { id: string }) => chat.id === conversation.id
                  )?.amount
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
      <CreateChat open={modalOpen} setOpen={setModalOpen} />
    </ConversationListWrapper>
  );
};
