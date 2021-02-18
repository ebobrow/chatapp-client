import axios from 'axios';
import { useQuery } from 'react-query';
import { ChatObject } from '../types';

const fetcher = async (): Promise<ChatObject[] | undefined> => {
  const { data } = await axios.get('/chat');

  return data.chats;
};

export const useConversations = () => {
  const queryObj = useQuery('conversations', fetcher);

  return queryObj;
};
