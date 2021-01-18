import axios from 'axios';
import { useQuery } from 'react-query';
import { friend } from '../types';

const fetcher = async (): Promise<friend[]> => {
  const { data } = await axios.get('/auth/friends/getnames');

  return data.friends;
};

export const useFriends = () => {
  const queryObj = useQuery('friends', () => fetcher());

  return queryObj;
};
