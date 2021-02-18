import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/auth/friends/recievedrequests');

  return data.requests;
};

export const useRecievedRequests = () => {
  const queryObj = useQuery<string[] | undefined, ApiError>(
    ['requests', 'recieved'],
    fetcher
  );

  return queryObj;
};
