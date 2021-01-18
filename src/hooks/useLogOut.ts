import { useMutation } from 'react-query';
import { axiosConfig } from '../api';

const fetcher = async () => {
  const { data } = await axiosConfig.post('/auth/logout', {});

  return data;
};

export const useLogOut = () => {
  // Weird workaround. Am I missing some way to pass options without params?
  const queryObj = useMutation((_: any) => fetcher());

  return queryObj;
};
