import axios from 'axios';
import { useQuery } from 'react-query';

type NotificationItem = {
  [key: string]: {
    new: boolean;
    chats: {
      id: string;
      amount: number;
    }[];
  };
};

const fetcher = async (): Promise<NotificationItem> => {
  const { data } = await axios.get('/chat/notifications');
  return data.notifications;
};

export const useNotifications = () => {
  const queryObj = useQuery('notifications', () => fetcher());

  return queryObj;
};
