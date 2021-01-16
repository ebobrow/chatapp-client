import React, {
  createContext,
  Context,
  useContext,
  useState,
  Dispatch
} from 'react';

type ChatContextObject = {
  chatId: string;
  setChatId: Dispatch<string>;
};

const ChatsContext: Context<ChatContextObject> = createContext(
  {} as ChatContextObject
);

export const useChatContext = () => {
  return useContext(ChatsContext);
};

export const ChatContext: React.FC = ({ children }) => {
  const [chatId, setChatId] = useState<string>('');

  return (
    <ChatsContext.Provider
      value={{
        chatId,
        setChatId
      }}>
      {children}
    </ChatsContext.Provider>
  );
};
