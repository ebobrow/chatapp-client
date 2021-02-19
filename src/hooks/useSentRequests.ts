import axios from 'axios';
import { useQuery } from 'react-query';
import { ApiError } from '../types';

const fetcher = async () => {
  const { data } = await axios.get('/friends/sentrequests');

  return data.requests;
};

export const useSentRequests = () => {
  const queryObj = useQuery<string[] | undefined, ApiError>(
    ['requests', 'sent'],
    fetcher
  );

  return queryObj;
};
