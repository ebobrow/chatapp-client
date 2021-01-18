import { useQuery } from 'react-query';
import { postRequest } from '../api';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  friends?: number[];
  created_at: string;
  modified_at: string;
}

const fetcher = async (auth: string | null): Promise<User | undefined> => {
  try {
    return postRequest('/auth/token', { auth });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const useUser = (token: string | null) => {
  const queryObj = useQuery(['user', token], () => fetcher(token));

  return queryObj;
};
