import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';
import { ChatObject } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/chat/chats');

  return data.chats;
};

export const useConversations = () => {
  const queryObj = useQuery('conversations', () =>
    catcher<ChatObject[]>(fetcher)
  );

  return queryObj;
};
