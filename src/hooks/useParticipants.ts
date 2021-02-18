import axios from 'axios';
import { useQuery } from 'react-query';

interface Participant {
  name: string;
  username: string;
}

const fetcher = async (
  id: string | undefined
): Promise<Participant[] | undefined> => {
  if (!id) return;
  const { data } = await axios.get(
    `/chat/participants/${encodeURIComponent(id)}`
  );
  return data.participants;
};

export const useParticipants = (id: string | undefined) => {
  const queryObj = useQuery(['participants', id], () => fetcher(id));

  return queryObj;
};
