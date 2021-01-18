import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async () => {
  const { data } = await axios.get('/auth/friends/recievedrequests');

  return data;
};

export const useRecievedRequests = () => {
  const queryObj = useQuery(['requests', 'recieved'], () => fetcher());

  return queryObj;
};
