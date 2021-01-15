import { useQuery } from 'react-query';
import { postRequest } from '../postRequest';

const fetcher = async (
  id: string
): Promise<
  { messages: Array<{ message: string; sender: string }> } | undefined
> => {
  try {
    return postRequest('/chat/getmessages', { id });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useMessages = (id: string) => {
  const queryObj = useQuery(['messages', id], () => fetcher(id));

  return queryObj;
};
