import axios from 'axios';
import { useQuery } from 'react-query';
import { FriendRequest } from '../types';

const fetcher = async (): Promise<FriendRequest[]> => {
  const { data } = await axios.get('/auth/friends/sentrequests');

  return data.requests;
};

export const useSentRequests = () => {
  const queryObj = useQuery(['requests', 'sent'], () => fetcher());

  return queryObj;
};
