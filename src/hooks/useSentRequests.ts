import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async (): Promise<string[] | undefined> => {
  const { data } = await axios.get('/auth/friends/sentrequests');

  return data.requests;
};

export const useSentRequests = () => {
  const queryObj = useQuery(['requests', 'sent'], fetcher);

  return queryObj;
};
