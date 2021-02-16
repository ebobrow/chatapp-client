import { TextField, Button } from '@material-ui/core';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  MessagesContainer,
  MessageWrapper,
  Message,
  ChatWrapper,
  TextNode,
  FlexFiller
} from './styled/Chat';
import { useChatContext } from '../contexts/ChatContext';
import { useSocketContext } from '../contexts/SocketContext';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import { useMessages } from '../hooks/useMessages';
import { useParticipants } from '../hooks/useParticipants';
import { useNotifications } from '../hooks/useNotifications';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { catcher } from '../api';

interface Props {
  w: string;
}

export const Conversation: React.FC<Props> = ({ w }) => {
  const { data: user } = useUser();
  const [form, setForm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatId } = useChatContext();
  const { socket } = useSocketContext();

  const { data: messages, isLoading: messagesLoading, refetch } = useMessages(
    chatId
  );
  const {
    data: participants,
    isLoading: participantsLoading
  } = useParticipants(chatId);
  const { refetch: refetchNotifications } = useNotifications();

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const setLastOpened = useCallback(async () => {
    await catcher(async () => {
      await axios.post('/chat/setopen', { chatId });
    });
    refetchNotifications();
  }, [chatId, refetchNotifications]);

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    socket.emit('new-message', {
      message: form,
      sender: user!.id,
      room: chatId
    });

    messages?.push({ message: form, sender: user!.username });
    // refetch();
    setForm('');
    setLastOpened();
  };

  useEffect(() => {
    scrollToBottom();
    socket.on('message', () => {
      scrollToBottom();
      refetch();
      setLastOpened();
    });

    return () => {
      socket.off();
    };
  }, [socket, scrollToBottom, setLastOpened, refetch]);

  useEffect(() => {
    scrollToBottom();
  }, [chatId, scrollToBottom]);

  return (
    <ChatWrapper w={w}>
      {messagesLoading || (participantsLoading && <h1>Loading...</h1>)}
      {chatId ? (
        <>
          <FlexFiller />
          <MessagesContainer>
            {messages &&
              messages.map((message, index) => {
                const isMine = message.sender === user?.username;
                return (
                  <MessageWrapper key={index} mymessage={isMine} row={index}>
                    <Message key={index} mymessage={isMine} row={index}>
                      <TextNode ismine={isMine} padding={true}>
                        {message.message}
                      </TextNode>
                    </Message>
                    <TextNode ismine={isMine} padding={false}>
                      {isMine
                        ? 'Me'
                        : participants?.find(p => p.username === message.sender)
                            ?.name}
                      {!isMine && (
                        <small
                          style={{
                            margin: '10px',
                            color:
                              participants
                                ?.filter(p => p.username !== user?.username) // Is this part necessary?
                                .findIndex(
                                  p => p.username === message.sender
                                ) || 2 % 2 === 0
                                ? PRIMARY_COLOR
                                : SECONDARY_COLOR
                          }}>
                          {message.sender}
                        </small>
                      )}
                    </TextNode>
                  </MessageWrapper>
                );
              })}
          </MessagesContainer>

          <form onSubmit={sendChat} style={{ paddingBottom: '10px' }}>
            <TextField
              type="text"
              value={form}
              onChange={e => {
                setForm(e.target.value);
              }}
              style={{ margin: '5px', width: '80%' }}
            />
            <Button
              disabled={form === ''}
              variant="contained"
              type="submit"
              disableElevation
              style={{ marginTop: '5px' }}>
              Send
            </Button>
          </form>
          <div ref={bottomRef} />
        </>
      ) : (
        <h1>No chat selected</h1>
      )}
    </ChatWrapper>
  );
};
