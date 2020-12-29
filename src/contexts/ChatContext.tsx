import React, { createContext, Context, useContext, useState, Dispatch } from 'react';
import { ChatObject } from '../types';

type ChatContextObject = {
  chat: ChatObject;
  setChat: Dispatch<ChatObject | null>;
};

const ChatsContext: Context<ChatContextObject> = createContext({} as ChatContextObject);

export const useChatContext = () => {
  return useContext(ChatsContext);
};

export const ChatContext: React.FC<{}> = ({ children }) => {
  const [chat, setChat] = useState<null | ChatObject>();

  return (
    <ChatsContext.Provider
      value={{
        chat: chat ? chat : {},
        setChat
      }}>
      {children}
    </ChatsContext.Provider>
  );
};
