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
  X,
  Info
} from './styled/Chat';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { useConversations } from '../hooks/useConversations';
import { catcher } from '../api';
import Badge from '@material-ui/core/Badge';
import { ChatInfo } from './ChatInfo';

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
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [chatInfoId, setChatInfoId] = useState('');
  const { setChatId, chatId } = useChatContext();
  const { socket } = useSocketContext();
  const { data, refetch: refetchNotifications } = useNotifications();

  const selectChat = async (key: number) => {
    if (chatId) {
      socket.emit('leave', chatId);
    }

    if (!conversations) return;

    await catcher(async () => {
      await axios.put('/chat/lastseen', { chatId: conversations[key].id });
    });

    setChatId(conversations[key].id);
    refetchNotifications();
    refetchConversations();
  };

  useEffect(() => {
    socket.emit('join', chatId);
  }, [chatId, socket]);

  return (
    <>
      <ConversationListWrapper w={w} open={open}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
          <FlexFiller />
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
                data?.Chat && (data?.Chat as any).chats.length
                  ? (data?.Chat as any).chats.find(
                      (chat: { id: string }) => chat.id === conversation.id
                    )?.amount
                  : 0 // This is so messy
              }
              color="secondary">
              <ConversationWrapper
                onClick={() => selectChat(index)}
                active={conversation.id === chatId}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column'
                  }}>
                  {conversation.name && <strong>{conversation.name}</strong>}
                  <p style={{ margin: 0 }}>
                    {conversation.participants?.join(', ')}
                  </p>
                </div>
                <Info
                  onClick={e => {
                    e.stopPropagation();
                    setChatInfoId(conversation.id);
                  }}
                />
              </ConversationWrapper>
            </Badge>
          ))}
        <FlexFiller />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FlexFiller />
          {open && <Plus onClick={_ => setCreateChatOpen(true)} />}
        </div>
        <CreateChat open={createChatOpen} setOpen={setCreateChatOpen} />
      </ConversationListWrapper>
      <ChatInfo
        id={chatInfoId}
        setId={setChatInfoId}
        refetchChats={refetchConversations}
      />
    </>
  );
};
