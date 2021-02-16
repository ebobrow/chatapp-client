import axios from 'axios';
import { useQuery } from 'react-query';
import { catcher } from '../api';

type NotificationItem = {
  [key: string]: {
    new: boolean;
    chats: {
      id: string;
      amount: number;
    }[];
  };
};

const fetcher = async () => {
  const { data } = await axios.get('/chat/notifications');
  return data.notifications;
};

export const useNotifications = () => {
  const queryObj = useQuery('notifications', () =>
    catcher<NotificationItem>(fetcher)
  );

  return queryObj;
};
