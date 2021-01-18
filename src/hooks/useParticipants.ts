import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async (
  id: string
): Promise<
  { participants: Array<{ name: string; username: string }> } | undefined
> => {
  try {
    const { data } = await axios.post('/chat/getparticipants', { id });
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useParticipants = (id: string) => {
  const queryObj = useQuery(['participants', id], () => fetcher(id));

  return queryObj;
};
