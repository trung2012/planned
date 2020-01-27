import React from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  const socket = io('/', {
    transports: ['websocket'],
    query: `token=${token}`,
  })

  return (
    <SocketContext.Provider
      value={{ socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
