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
  const [messages, setMessages] = useState<Array<message>>([]);
  const [participants, setParticipants] = useState<Array<participant>>([]);
  const [form, setForm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatId } = useChatContext();
  const { socket } = useSocketContext();

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    socket.emit('new-message', {
      message: form,
      sender: user!.username,
      room: chatId
    });
    setMessages(curr => [...curr, { sender: user!.username, message: form }]);
    setForm('');
    postRequest('/chat/setopen', {
      username: user?.username,
      chatId
    });
  };

  useEffect(() => {
    scrollToBottom();
    socket.on(
      'message',
      ({ message, sender }: { message: string; sender: string }) => {
        scrollToBottom();
        setMessages(curr => [...curr, { message, sender }]);
        postRequest('/chat/setopen', {
          username: user?.username,
          chatId
        });
      }
    );

    return () => {
      socket.off();
    };
  }, [socket, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();

    if (!chatId) return;
    postRequest('/chat/getmessages', { id: chatId }).then(data => {
      setMessages(data.messages);
    });

    postRequest('/chat/getparticipants', { id: chatId }).then(data => {
      setParticipants(data.participants);
    });
  }, [chatId, scrollToBottom]);

  return (
    <ChatWrapper w={w}>
      {chatId ? (
        <>
          <FlexFiller />
          <MessagesContainer>
            {messages.map((message, index) => {
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
                      : participants.find(p => p.username === message.sender)
                          ?.name}
                    {!isMine && (
                      <small
                        style={{
                          margin: '10px',
                          color:
                            participants
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
