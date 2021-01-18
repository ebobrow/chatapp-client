import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async (
  id: string
): Promise<
  { messages: Array<{ message: string; sender: string }> } | undefined
> => {
  try {
    const { data } = await axios.post('/chat/getmessages', { id });
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useMessages = (id: string) => {
  const queryObj = useQuery(['messages', id], () => fetcher(id));

  return queryObj;
};
