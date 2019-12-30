import React, { useCallback } from 'react';
import io from 'socket.io-client';

const token = localStorage.getItem('token');

export const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const socket = useCallback(io('http://localhost:5000/', {
    transports: ['websocket'],
    query: `token=${token}`
  }), []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};
