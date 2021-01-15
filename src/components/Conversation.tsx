import { TextField, Button } from '@material-ui/core';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useAuthContext } from '../contexts/AuthContext';
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
import { postRequest } from '../postRequest';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import { useMessages } from '../hooks/useMessages';
import { useParticipants } from '../hooks/useParticipants';

interface Props {
  w: string;
}

interface message {
  message: string;
  sender: string;
}

interface participant {
  name: string;
  username: string;
}

export const Conversation: React.FC<Props> = ({ w }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Array<message> | undefined>([]);
  const [participants, setParticipants] = useState<
    Array<participant> | undefined
  >([]);
  const [form, setForm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatId } = useChatContext();
  const { socket } = useSocketContext();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch
  } = useMessages(chatId);
  const { data: participantsData } = useParticipants(chatId);

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const setLastOpened = useCallback(() => {
    postRequest('/chat/setopen', {
      username: user?.username,
      chatId
    });
  }, [user?.username, chatId]);

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    socket.emit('new-message', {
      message: form,
      sender: user!.username,
      room: chatId
    });
    refetch();
    setMessages(curr =>
      curr
        ? [...curr, { sender: user!.username, message: form }]
        : [{ sender: user!.username, message: form }]
    );
    setForm('');
    setLastOpened();
  };

  useEffect(() => {
    scrollToBottom();
    socket.on(
      'message',
      ({ message, sender }: { message: string; sender: string }) => {
        scrollToBottom();
        setMessages(curr =>
          curr ? [...curr, { message, sender }] : [{ message, sender }]
        );
        setLastOpened();
      }
    );

    return () => {
      socket.off();
    };
  }, [socket, scrollToBottom, setLastOpened]);

  useEffect(() => {
    scrollToBottom();

    if (!chatId) return;
    setMessages(messagesData?.messages);
    setParticipants(participantsData?.participants);
  }, [chatId, scrollToBottom]);

  return (
    <ChatWrapper w={w}>
      {messagesLoading || (!participants && <h1>Loading...</h1>)}
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
                        : participants!.find(p => p.username === message.sender)
                            ?.name}
                      {!isMine && (
                        <small
                          style={{
                            margin: '10px',
                            color:
                              participants!
                                .filter(p => p.username !== user?.username) // Is this part necessary?
                                .findIndex(p => p.username === message.sender) %
                                2 ===
                              0
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

          <form onSubmit={sendChat}>
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
            <div ref={bottomRef} style={{ height: '10px' }} />
          </form>
        </>
      ) : (
        <h1>No chat selected</h1>
      )}
    </ChatWrapper>
  );
};
