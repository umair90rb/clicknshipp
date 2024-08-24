import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080';

export default function useSocket() {
  const socket = useRef();

  const connect = () => {
    socket.current = io(URL);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };

  useEffect(() => {
    socket.current?.on('connect', () => console.log('socket connected'));
    socket.current?.on('disconnect', () => console.log('socket disconnected'));
  }, []);

  return { socket: socket.current, connect, disconnect };
}
