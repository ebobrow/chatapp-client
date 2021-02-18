import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';
import { Friend } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/auth/friends/names');

  return data.friends;
};

export const useFriends = () => {
  const queryObj = useQuery('friends', () => catcher<Friend[]>(fetcher));

  return queryObj;
};
