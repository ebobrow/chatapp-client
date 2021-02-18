import { AxiosError } from 'axios';
import { ApiError } from './types';

export const axiosErrorHandler = (error: AxiosError): Promise<ApiError> => {
  const { response } = error;
  if (response) {
    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      error: response.data.error,
      data: response.data
    });
  } else {
    return Promise.reject({
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Something went wrong'
    });
  }
};

export const getErrorUrl = (error: ApiError) =>
  `/error?status=${error.status}&status-text=${error.statusText}&message=${error.error}`;
