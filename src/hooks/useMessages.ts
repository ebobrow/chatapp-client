import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async (
  id: string
): Promise<Array<{ message: string; sender: string }> | undefined> => {
  try {
    const { data } = await axios.post('/chat/getmessages', { id });

    // I don't like that the sorting happens outside the db query
    return data.messages.sort(
      // @ts-ignore
      (a: any, b: any) => new Date(a.sent_at) - new Date(b.sent_at)
    );
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useMessages = (id: string) => {
  const queryObj = useQuery(['messages', id], () => fetcher(id));

  return queryObj;
};
