import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError } from '../types';

interface Participant {
  name: string;
  username: string;
}

const fetcher = async (id: string | undefined) => {
  if (!id) return;
  const { data } = await axios.get(
    `/chat/participants/${encodeURIComponent(id)}`
  );
  return data.participants;
};

export const useParticipants = (id: string | undefined) => {
  const queryObj = useQuery<Participant[] | undefined, ApiError>(
    ['participants', id],
    () => fetcher(id)
  );

  return queryObj;
};
