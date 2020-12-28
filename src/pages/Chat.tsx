import React, { FormEvent, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { TextField, Button } from '@material-ui/core';
import { Message, MessagesContainer } from '../components/StyledComponents';

interface message {
  text: string;
  sender: string;
}

const socket = io(API_URL);

export const Chat: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();
  const [messages, setMessages] = useState<Array<message>>([]);
  const [form, setForm] = useState('');

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('new-message', form);
    setMessages(curr => [...curr, { sender: 'me', text: form }]);
    setForm('');
  };

  useEffect(() => {
    socket.on('message', ({ message, sender }: { message: string; sender: string }) => {
      setMessages(curr => [...curr, { text: message, sender }]);
    });

    return () => {
      socket.off();
    };
  });

  return (
    <>
      {!loggedIn && <Redirect to="/login" />}
      <h1>Chat!</h1>

      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index} mymessage={message.sender === 'me'} row={index}>
            {message.text}
          </Message>
        ))}
      </MessagesContainer>

      <form onSubmit={sendChat}>
        <TextField
          type="text"
          value={form}
          onChange={e => {
            setForm(e.target.value);
          }}
          style={{ margin: '5px', width: '300px' }}
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
  );
};
