import axios from 'axios';
import { useMutation } from 'react-query';
import { ApiError } from '../types';

const fetcher = async () => {
  const { data } = await axios.post('/auth/logout', {});

  return data;
};

export const useLogOut = () => {
  // Weird workaround. Am I missing some way to pass options without params?
  const queryObj = useMutation<any, ApiError, any>((_: any) => fetcher());

  return queryObj;
};
