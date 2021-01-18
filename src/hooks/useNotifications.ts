import { useQuery } from 'react-query';
import { axiosConfig } from '../api';

type NotificationItem = {
  [key: string]: {
    new: boolean;
    chats: {
      id: string;
      amount: number;
    }[];
  };
};

const fetcher = async (): Promise<{ notifications: NotificationItem }> => {
  const { data } = await axiosConfig.get('/chat/notifications');
  return data;
};
export const useNotifications = () => {
  const queryObj = useQuery('notifications', () => fetcher());

  return queryObj;
};
