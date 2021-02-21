import axios from 'axios';
import { QueryFunction, useInfiniteQuery } from 'react-query';
import { ApiError, Message } from '../types';

interface ResponseType {
  messages: Message[];
  nextCursor: number | null;
}

const fetcher: QueryFunction<ResponseType | undefined> = async ({
  pageParam,
  queryKey
}) => {
  const id = queryKey[1];
  if (!id) return;

  const { data } = await axios.get('/chat/messages', {
    params: { id, cursor: pageParam || null }
  });
  return data;
};

export const useMessages = (id: string | undefined) => {
  const queryObj = useInfiniteQuery<ResponseType | undefined, ApiError>(
    ['messages', id],
    fetcher,
    {
      getNextPageParam: lastPage => lastPage?.nextCursor ?? false,
      getPreviousPageParam: firstPage => firstPage?.nextCursor ?? false
    }
  );

  return queryObj;
};
