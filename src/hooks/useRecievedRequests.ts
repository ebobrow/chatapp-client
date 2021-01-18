import axios from 'axios';
import { useQuery } from 'react-query';
import { FriendRequest } from '../types';

const fetcher = async (): Promise<FriendRequest[]> => {
  const { data } = await axios.get('/auth/friends/recievedrequests');

  return data.requests;
};

export const useRecievedRequests = () => {
  const queryObj = useQuery(['requests', 'recieved'], () => fetcher());

  return queryObj;
};
