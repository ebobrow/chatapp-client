import React, {
  Context,
  createContext,
  SetStateAction,
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
  setNotifications: (value: SetStateAction<NotificationItem[]>) => void;
  changeNew: (name: string, seen: boolean) => void;
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

  const changeNew = (name: string, seen: boolean) => {
    setNotifications(curr =>
      curr.map(not => (not.name === name ? { ...not, new: seen } : not))
    );
  };

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <ContextItem.Provider
      value={{ notifications, setNotifications, changeNew }}>
      {children}
    </ContextItem.Provider>
  );
};
