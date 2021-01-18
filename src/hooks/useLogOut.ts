import axios from 'axios';
import { useMutation } from 'react-query';

const fetcher = async () => {
  const { data } = await axios.post('/auth/logout', {});

  return data;
};

export const useLogOut = () => {
  // Weird workaround. Am I missing some way to pass options without params?
  const queryObj = useMutation((_: any) => fetcher());

  return queryObj;
};
