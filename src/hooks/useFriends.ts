import axios from 'axios';
import { useQuery } from 'react-query';
import { Friend } from '../types';

const fetcher = async (): Promise<Friend[] | undefined> => {
  const { data } = await axios.get('/auth/friends/names');

  return data.friends;
};

export const useFriends = () => {
  const queryObj = useQuery('friends', fetcher);

  return queryObj;
};
