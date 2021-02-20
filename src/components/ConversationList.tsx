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
import Badge from '@material-ui/core/Badge';
import { ChatInfo } from './ChatInfo';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';

interface Props {
  w: string;
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const ConversationList: React.FC<Props> = ({ w, open, setOpen }) => {
  const history = useHistory();
  const { data: user } = useUser();
  const {
    data: chats,
    refetch: refetchConversations,
    error: conversationsError
  } = useConversations();
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
  const {
    data,
    refetch: refetchNotifications,
    error: notificationsError
  } = useNotifications();

  const selectChat = (key: number) => {
    if (chatId) {
      socket.emit('leave', chatId);
    }

    if (!conversations) return;

    axios
      .put('/chat/lastseen', { chatId: conversations[key].id })
      .then(() => {
        setChatId(conversations[key].id);
        refetchNotifications();
        refetchConversations();
      })
      .catch(err => {
        history.push(getErrorUrl(err));
      });
  };

  useEffect(() => {
    socket.emit('join', chatId);
  }, [chatId, socket]);

  if (notificationsError) {
    history.push(getErrorUrl(notificationsError));
  }
  if (conversationsError) {
    history.push(getErrorUrl(conversationsError));
  }

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
            <ConversationWrapper
              onClick={() => selectChat(index)}
              active={conversation.id === chatId}>
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    padding: '5px'
                  }}>
                  {conversation.name && <strong>{conversation.name}</strong>}
                  <p style={{ margin: 0 }}>
                    {conversation.participants?.join(', ')}
                  </p>
                </div>
              </Badge>
              <Info
                onClick={e => {
                  e.stopPropagation();
                  setChatInfoId(conversation.id);
                }}
              />
            </ConversationWrapper>
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
