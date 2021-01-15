import { useQuery } from 'react-query';
import { postRequest } from '../postRequest';

const fetcher = async (
  id: string
): Promise<
  { participants: Array<{ name: string; username: string }> } | undefined
> => {
  try {
    return postRequest('/chat/getparticipants', { id });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useParticipants = (id: string) => {
  const queryObj = useQuery(['participants', id], () => fetcher(id));

  return queryObj;
};
