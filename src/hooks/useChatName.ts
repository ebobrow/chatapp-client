import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';

const fetcher = async (id: string | undefined) => {
  if (!id) return;
  const { data } = await axios.get(`/chat/name/${encodeURIComponent(id)}`);

  return data;
};

export const useChatName = (id: string | undefined) => {
  const queryObj = useQuery(['chatName', id], () =>
    catcher<string>(() => fetcher(id))
  );

  return queryObj;
};
