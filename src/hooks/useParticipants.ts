import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';

interface Participant {
  name: string;
  username: string;
}

const fetcher = async (id: string) => {
  const { data } = await axios.post('/chat/getparticipants', { id });
  return data.participants;
};

export const useParticipants = (id: string) => {
  const queryObj = useQuery(['participants', id], () =>
    catcher<Participant[]>(() => fetcher(id))
  );

  return queryObj;
};
