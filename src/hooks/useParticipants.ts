import { useQuery } from 'react-query';
import { axiosConfig } from '../api';

const fetcher = async (
  id: string
): Promise<
  { participants: Array<{ name: string; username: string }> } | undefined
> => {
  try {
    const { data } = await axiosConfig.post('/chat/getparticipants', { id });
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
