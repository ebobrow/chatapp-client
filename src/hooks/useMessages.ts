import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError, Message } from '../types';

const fetcher = async (id: string | undefined) => {
  if (!id) return;
  const { data } = await axios.get(`/chat/messages/${encodeURIComponent(id)}`);

  return data.messages;
};

export const useMessages = (id: string | undefined) => {
  const queryObj = useQuery<Message[] | undefined, ApiError>(
    ['messages', id],
    () => fetcher(id)
  );

  return queryObj;
};
