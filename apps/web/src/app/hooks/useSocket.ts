'use client';
import {useEffect, useState} from 'react';
import {io, type Socket} from 'socket.io-client';
import {API_URL} from '@wordsearch/config';

export const useSocket = (): { socket: Socket | null } => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(API_URL, {
            path: '/api/socket', // se usa el mismo path que en el módulo de websocket
            autoConnect: false,
            transports: ['websocket'],
        });

        console.log('Socket created (useSocket)');

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket };
};
