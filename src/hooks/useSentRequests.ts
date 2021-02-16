import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';

const fetcher = async () => {
  const { data } = await axios.get('/auth/friends/sentrequests');

  return data.requests;
};

export const useSentRequests = () => {
  const queryObj = useQuery(['requests', 'sent'], () =>
    catcher<string[]>(fetcher)
  );

  return queryObj;
};
