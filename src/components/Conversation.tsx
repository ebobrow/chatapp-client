import { TextField, Button } from '@material-ui/core';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
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

interface Props {
  w: string;
}

interface message {
  message: string;
  sender: string;
}

export const Conversation: React.FC<Props> = ({ w }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Array<message>>([]);
  const [form, setForm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatId } = useChatContext();
  const { socket } = useSocketContext();

  const scrollToBottom = useCallback(() => {
    bottomRef.current!.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    socket.emit('new-message', { message: form, sender: user!.name, room: chatId });
    setMessages(curr => [...curr, { sender: user!.name, message: form }]);
    setForm('');
  };

  useEffect(() => {
    scrollToBottom();
    socket.on('message', ({ message, sender }: { message: string; sender: string }) => {
      scrollToBottom();
      setMessages(curr => [...curr, { message, sender }]);
    });

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
  }, [chatId, scrollToBottom]);

  return (
    <ChatWrapper w={w}>
      {chatId ? (
        <>
          <FlexFiller />
          <MessagesContainer>
            {messages.map((message, index) => {
              const isMine = message.sender === user?.name;
              return (
                <MessageWrapper key={index} mymessage={isMine} row={index}>
                  <Message key={index} mymessage={isMine} row={index}>
                    <TextNode ismine={isMine} padding={true}>
                      {message.message}
                    </TextNode>
                  </Message>
                  <TextNode ismine={isMine} padding={false}>
                    {isMine ? 'Me' : message.sender}
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
          </form>
        </>
      ) : (
        <h1>No chat selected</h1>
      )}
      <div ref={bottomRef} style={{ height: '10px' }}>
        {/* jhgjhgjhgj */}
      </div>
    </ChatWrapper>
  );
};
