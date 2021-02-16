import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';
import { Message } from '../types';

const fetcher = async (id: string) => {
  const { data } = await axios.post('/chat/getmessages', { id });

  return data.messages;
};

export const useMessages = (id: string) => {
  const queryObj = useQuery(['messages', id], () =>
    catcher<Message[]>(() => fetcher(id))
  );

  return queryObj;
};
