import {io, type Socket} from 'socket.io-client';
import type {Cell, Difficulty, RoomID} from '../domain/types';

const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

let socket: Socket | null = null;

export const generateRoomId = (): RoomID => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const connectWebSocket = async (): Promise<Socket> => {
    if (!socket) {
        console.log('Connecting to WebSocket server...');

        socket = io(WS_URL, {
            path: '/api/socket',
            autoConnect: false,
            transports: ['websocket'],
        });

        console.log('Socket created');

        await new Promise<void>((resolve, reject) => {
            socket!
                .on('connection', resolve)
                .on('connection_error', reject)
                .connect();
        });
    }
    return socket;
};

export const createRoom = async (difficulty: Difficulty): Promise<RoomID> => {
    const roomId = generateRoomId();
    const socket = await connectWebSocket();

    socket.emit('createRoom', {
        roomId,
        difficulty,
        grid: generateGrid(difficulty) // Grid generado correctamente
    });

    return roomId;
};

// Función corregida con tipos Cell[][]
const generateGrid = (difficulty: Difficulty): Cell[][] => {
    const size = {
        Easy: 10,
        Medium: 12,
        Hard: 15,
        Expert: 18,
        Numbers: 10
    }[difficulty];

    return Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (__, x) => ({
            x,
            y,
            letter: difficulty === 'Numbers'
                ? Math.floor(Math.random() * 9 + 1).toString()
                : String.fromCharCode(65 + Math.floor(Math.random() * 26)),
            foundBy: null
        }))
    );
};