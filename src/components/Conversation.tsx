import React, {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  MessagesContainer,
  MessageWrapper,
  Message,
  ChatWrapper,
  TextNode,
  FlexFiller,
  MessageForm
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
import { Loading } from './Loading';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface Props {
  w: string;
}

export const Conversation: React.FC<Props> = ({ w }) => {
  const { data: user } = useUser();
  const [form, setForm] = useState('');
  const [atBottom, setAtBottom] = useState(true);
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

  const processedMessages = useMemo(
    () =>
      messages?.map((message, index) => ({
        ...message,
        last:
          index === messages.length - 1 ||
          message.sender !== messages[index + 1].sender
      })),
    [messages]
  );

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
    socket.emit('new-message', {
      message: form,
      sender: user!.id,
      room: chatId
    });

    processedMessages?.push({
      message: form,
      sender: user!.username,
      last: true
    });
    refetch();
    setForm('');
    setLastOpened();
    scrollToBottom();
  };

  useEffect(() => {
    socket.on('message', () => {
      refetch();
      setLastOpened();
      setTimeout(scrollToBottom, 500);
      scrollToBottom();
    });

    return () => {
      socket.off();
    };
  }, [socket, scrollToBottom, setLastOpened, refetch]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chatId, scrollToBottom]);

  const handleScroll = () => {
    if (!bottomRef.current) return;
    const top = bottomRef.current.getBoundingClientRect().top;
    const visible = top >= 0 && top <= window.innerHeight;
    setAtBottom(visible);
  };

  let content: JSX.Element;

  if (messagesLoading || participantsLoading) {
    content = <Loading />;
  } else if (chatId) {
    content = (
      <>
        <FlexFiller />
        <div style={{ overflowY: 'scroll' }} onScroll={handleScroll}>
          <MessagesContainer>
            {processedMessages &&
              processedMessages.map((message, index) => {
                const isMine = message.sender === user?.username;
                return (
                  <MessageWrapper key={index} mymessage={isMine} row={index}>
                    <Message key={index} mymessage={isMine} row={index}>
                      <TextNode ismine={isMine} padding={true}>
                        {message.message}
                      </TextNode>
                    </Message>
                    {message.last && (
                      <TextNode ismine={isMine} padding={false}>
                        {isMine
                          ? 'Me'
                          : participants?.find(
                              p => p.username === message.sender
                            )?.name}
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
                    )}
                  </MessageWrapper>
                );
              })}
          </MessagesContainer>
          <div ref={bottomRef} />
        </div>

        <MessageForm onSubmit={sendChat} atBottom={atBottom}>
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
        </MessageForm>
      </>
    );
  } else {
    content = <h1>No chat selected</h1>;
  }

  return <ChatWrapper w={w}>{content}</ChatWrapper>;
};
