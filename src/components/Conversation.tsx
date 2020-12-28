import { TextField, Button } from '@material-ui/core';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import {
  MessagesContainer,
  MessageWrapper,
  Message,
  ChatWrapper,
  TextNode
} from './styled/Chat';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
}

interface message {
  text: string;
  sender: string;
}

export const Conversation: React.FC<Props> = ({ socket }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Array<message>>([]);
  const [form, setForm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current!.scrollIntoView({ behavior: 'smooth' });
  };

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    socket.emit('new-message', { message: form, sender: user!.name });
    setMessages(curr => [...curr, { sender: user!.name, text: form }]);
    setForm('');
  };

  useEffect(() => {
    scrollToBottom();
    socket.on('message', ({ message, sender }: { message: string; sender: string }) => {
      scrollToBottom();
      setMessages(curr => [...curr, { text: message, sender }]);
    });

    return () => {
      socket.off();
    };
  }, [socket]);

  return (
    <ChatWrapper>
      <div style={{ flexGrow: 1 }} />
      <MessagesContainer>
        {messages.map((message, index) => {
          const isMine = message.sender === user?.name;
          return (
            <MessageWrapper key={index} mymessage={isMine} row={index}>
              <Message key={index} mymessage={isMine} row={index}>
                <TextNode ismine={isMine}>{message.text}</TextNode>
              </Message>
              <TextNode ismine={isMine}>{isMine ? 'Me' : message.sender}</TextNode>
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
      </form>
      <div ref={bottomRef}></div>
    </ChatWrapper>
  );
};
