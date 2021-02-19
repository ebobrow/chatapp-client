import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError, Friend } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/friends/names');

  return data.friends;
};

export const useFriends = () => {
  const queryObj = useQuery<Friend[] | undefined, ApiError>('friends', fetcher);

  return queryObj;
};
