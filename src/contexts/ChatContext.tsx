import React, {
  createContext,
  Context,
  useContext,
  useState,
  Dispatch,
  useEffect
} from 'react';

type ChatContextObject = {
  chatId: string;
  setChatId: Dispatch<string>;
};

const ChatsContext: Context<ChatContextObject> = createContext({} as ChatContextObject);

export const useChatContext = () => {
  return useContext(ChatsContext);
};

export const ChatContext: React.FC<{}> = ({ children }) => {
  const [chatId, setChatId] = useState<string>('');
  useEffect(() => {
    console.log(chatId);
  }, [chatId]);

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
