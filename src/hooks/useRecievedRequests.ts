import axios from 'axios';
import { useQuery } from 'react-query';

const fetcher = async (): Promise<
  {
    id: number;
    sender: string;
    reciever: string;
    seen: boolean;
  }[]
> => {
  const { data } = await axios.get('/auth/friends/recievedrequests');

  return data.requests;
};

export const useRecievedRequests = () => {
  const queryObj = useQuery(['requests', 'recieved'], () => fetcher());

  return queryObj;
};
