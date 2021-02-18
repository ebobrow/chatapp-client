import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError } from '../types';

const fetcher = async (id: string | undefined) => {
  if (!id) return;
  const { data } = await axios.get(`/chat/name/${encodeURIComponent(id)}`);

  return data;
};

export const useChatName = (id: string | undefined) => {
  const queryObj = useQuery<string | undefined, ApiError>(
    ['chatName', id],
    () => fetcher(id)
  );

  return queryObj;
};
