import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

type NotificationItem =
  | {
      name: 'Chat';
      new: boolean;
      chats: {
        id: string;
        amount: string;
      }[];
    }
  | {
      name: 'Friends';
      new: boolean;
    };

interface NotificationContextItem {
  notifications: Array<NotificationItem>;
  setNotifications: any;
}

const ContextItem: Context<NotificationContextItem> = createContext(
  {} as NotificationContextItem
);

export const useNotificationContext = () => {
  return useContext(ContextItem);
};

export const NotificationContext: React.FC<{}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Array<NotificationItem>>([
    { name: 'Chat', new: false, chats: [] },
    { name: 'Friends', new: false }
  ]);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <ContextItem.Provider value={{ notifications, setNotifications }}>
      {children}
    </ContextItem.Provider>
  );
};
