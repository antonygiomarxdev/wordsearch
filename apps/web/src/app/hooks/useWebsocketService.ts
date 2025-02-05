'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@wordsearch/config';

export interface WebSocketService {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  emit: <T extends any[]>(event: string, ...data: [...T, ((...args: any[]) => void)?]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string) => void;
}

export const useWebSocketService = (): WebSocketService => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const eventListeners = useRef(new Map<string, (...args: any[]) => void>());

  const connect = useCallback(async () => {
    if (socketInstance) return;

    console.log('Connecting to WebSocket server...');
    const newSocket = io(API_URL, {
      path: '/api/socket',
      autoConnect: false,
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    eventListeners.current.forEach((listener, eventName) => {
      newSocket.on(eventName, listener);
    });

    setSocketInstance(newSocket);
    newSocket.connect();
  }, [socketInstance]);

  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect();
      setSocketInstance(null);
      setIsConnected(false);
    }
  }, [socketInstance]);

  // ✅ Modified emit implementation to handle multiple data arguments
  const emit = useCallback(
    <T extends any[]>(event: string, ...data: [...T, ((...args: any[]) => void)?]) => {
      if (socketInstance && isConnected) {
        socketInstance.emit(event, ...data); // Spread the data arguments
      } else {
        console.warn(`Socket not connected, cannot emit event: ${event}`);
      }
    },
    [socketInstance, isConnected]
  );

  const on = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (socketInstance) {
        socketInstance.on(event, listener);
        eventListeners.current.set(event, listener);
      } else {
        console.warn(`Socket not initialized, cannot attach listener for event: ${event}`);
      }
    },
    [socketInstance]
  );

  const off = useCallback(
    (event: string) => {
      if (socketInstance) {
        socketInstance.off(event);
        eventListeners.current.delete(event);
      }
    },
    [socketInstance]
  );

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    socket: socketInstance,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};
