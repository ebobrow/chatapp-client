import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError } from '../types';

interface User {
  id: number;
  name: string;
  username: string;
  created_at: string;
  modified_at: string;
}

const fetcher = async () => {
  try {
    const { data } = await axios.get('/auth/token');
    return data.user;
  } catch (error) {
    return;
  }
};

export const useUser = () => {
  const queryObj = useQuery<User | undefined, ApiError>('user', fetcher);

  return queryObj;
};
