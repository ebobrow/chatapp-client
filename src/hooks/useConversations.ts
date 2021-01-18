import axios from 'axios';
import { useQuery } from 'react-query';
import { ChatObject } from '../types';

const fetcher = async (): Promise<ChatObject[]> => {
  const { data } = await axios.get('/chat/chats');

  return data.chats.sort((a: { id: string }, b: { id: string }) => {
    const aId = a.id.substring(0, 1);
    const bId = b.id.substring(0, 1);

    return aId !== bId ? (aId > bId ? 1 : -1) : 0;
  });
};

export const useConversations = () => {
  const queryObj = useQuery('conversations', () => fetcher());

  return queryObj;
};
