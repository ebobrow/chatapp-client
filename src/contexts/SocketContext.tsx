import React, { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants';

interface SocketContextObject {
  socket: Socket;
}

const socket = io(API_URL);

const Context = createContext({} as SocketContextObject);

export const useSocketContext = () => {
  return useContext(Context);
};

export const SocketContext: React.FC = ({ children }) => {
  return <Context.Provider value={{ socket }}>{children}</Context.Provider>;
};
