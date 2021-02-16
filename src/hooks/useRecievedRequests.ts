import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';

const fetcher = async () => {
  const { data } = await axios.get('/auth/friends/recievedrequests');

  return data.requests;
};

export const useRecievedRequests = () => {
  const queryObj = useQuery(['requests', 'recieved'], () =>
    catcher<string[]>(fetcher)
  );

  return queryObj;
};
