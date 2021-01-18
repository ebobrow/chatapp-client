import axios from 'axios';
import { useQuery } from 'react-query';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  friends?: number[];
  created_at: string;
  modified_at: string;
}

const fetcher = async (): Promise<{ user: User } | undefined> => {
  try {
    const { data } = await axios.get('/auth/token');
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useUser = () => {
  const queryObj = useQuery(['user'], () => fetcher());

  return queryObj;
};
