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
import { Loading } from './Loading';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';
import { Message as MessageType } from '../types';

interface Props {
  w: string;
}

export const Conversation: React.FC<Props> = ({ w }) => {
  const history = useHistory();
  const { data: user } = useUser();
  const [form, setForm] = useState('');
  const [atBottom, setAtBottom] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const loadingMoreTexts = useRef<HTMLDivElement>(null);
  const { chatId } = useChatContext();
  const { socket } = useSocketContext();

  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
    error: messagesError,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage
  } = useMessages(chatId);
  const {
    data: participants,
    isLoading: participantsLoading,
    error: participantsError
  } = useParticipants(chatId);
  const {
    refetch: refetchNotifications,
    error: notificationsError
  } = useNotifications();

  const processedMessages = useMemo(() => {
    let flattened: MessageType[] = [];
    messages?.pages.forEach(page =>
      page?.messages.forEach(message => flattened.push(message))
    );

    return flattened.map((message, index) => ({
      ...message,
      last:
        index === flattened.length - 1 ||
        message.sender !== flattened[index + 1].sender
    }));
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const setLastOpened = useCallback(async () => {
    await axios.put('/chat/lastseen', { chatId });
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
    refetchMessages();
    setForm('');
    setLastOpened();
    scrollToBottom();
  };

  useEffect(() => {
    socket.on('message', () => {
      refetchMessages();
      setLastOpened();
      setTimeout(scrollToBottom, 500);
      scrollToBottom();
    });

    return () => {
      socket.off();
    };
  }, [socket, scrollToBottom, setLastOpened, refetchMessages]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chatId, scrollToBottom]);

  if (messagesError) {
    history.push(getErrorUrl(messagesError));
  }
  if (notificationsError) {
    history.push(getErrorUrl(notificationsError));
  }
  if (participantsError) {
    history.push(getErrorUrl(participantsError));
  }

  const handleScroll = () => {
    if (!bottomRef.current || !topRef.current) return;
    const top = bottomRef.current.getBoundingClientRect().top;
    setAtBottom(top >= 0 && top <= window.innerHeight);

    const scroll = topRef.current.scrollTop;

    if (scroll === 0 && hasPreviousPage) {
      fetchPreviousPage();
    }
  };

  let content: JSX.Element;

  if (messagesLoading || participantsLoading) {
    content = <Loading />;
  } else if (chatId) {
    content = (
      <>
        {!processedMessages?.length && <h1>No messages... yet</h1>}
        <FlexFiller />
        <div
          ref={topRef}
          style={{ overflowY: 'scroll' }}
          onScroll={handleScroll}>
          {isFetchingPreviousPage && <h1 ref={loadingMoreTexts}>...</h1>}
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
