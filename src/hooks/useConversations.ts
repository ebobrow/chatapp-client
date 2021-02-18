import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError, ChatObject } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/chat');

  return data.chats;
};

export const useConversations = () => {
  const queryObj = useQuery<ChatObject[] | undefined, ApiError>(
    'conversations',
    fetcher
  );

  return queryObj;
};
