import { useQuery } from 'react-query';
import { postRequest } from '../postRequest';

type NotificationItem = {
  [key: string]: {
    new: boolean;
    chats: {
      id: string;
      amount: number;
    }[];
  };
};

const fetcher = (
  username: string | undefined,
  id: number | undefined
): Promise<{ notifications: NotificationItem }> => {
  return postRequest('/chat/notifications', { username, id });
};
export const useNotifications = (
  username: string | undefined,
  id: number | undefined
) => {
  const queryObj = useQuery('notifications', () => fetcher(username, id));

  return queryObj;
};
