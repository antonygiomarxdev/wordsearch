'use server';
import {NextResponse} from 'next/server';
import {Server} from 'socket.io';
import type {Cell, Difficulty, GameState, Player, RoomID} from '@/app/game/shared/domain/types';
import {Http2Server} from "node:http2";

// Definición de tipos para los eventos del WebSocket
type SocketEvents = {
    createRoom: (payload: { roomId: RoomID; difficulty: Difficulty }) => void;
    joinRoom: (
        payload: { roomId: RoomID; player: Omit<Player, 'id' | 'color'> },
        callback: (res: { success: boolean; state?: GameState }) => void
    ) => void;
    wordFound: (payload: { roomId: RoomID; cells: [number, number][]; playerId: string }) => void;
    roomUpdate: (state: GameState) => void;
};

interface ExtendedServer {
    io?: Server;
    httpServer?: Http2Server;
}

interface ExtendedNextResponse {
    socket: {
        server: ExtendedServer;
    };
}

const activeRooms = new Map<RoomID, GameState>();

const getPlayerColor = (index: number): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    return colors[index % colors.length];
};

const validateWord = (difficulty: Difficulty, word: string): boolean => {
    const wordLists: Record<Difficulty, string[]> = {
        Easy: ['HTML', 'CSS', 'JS'],
        Medium: ['REACT', 'NEXTJS', 'NODE'],
        Hard: ['TYPESCRIPT', 'WEBPACK', 'BUNDLER'],
        Expert: ['MICROSERVICES', 'GRAPHQL', 'WEBSOCKETS'],
        Numbers: ['314', '2718', '1618']
    };

    const normalizedWord = word.toUpperCase();
    return wordLists[difficulty].includes(normalizedWord) ||
        wordLists[difficulty].includes(normalizedWord.split('').reverse().join(''));
};

const generateInitialGrid = (difficulty: Difficulty): Cell[][] => {
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

export async function POST() {
    const extendedResponse = NextResponse as unknown as ExtendedNextResponse;
    const { server } = extendedResponse.socket;

    if (!server.io) {
        console.log('Inicializando Socket.IO...');

        // Corregimos el tipo del servidor HTTP
        const httpServer: Http2Server = server.httpServer as Http2Server;

        const io = new Server<SocketEvents>(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
            cors: {
                origin: process.env.NODE_ENV === 'production'
                    ? 'https://yourdomain.com'
                    : 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('Nueva conexión:', socket.id);

            socket.on('createRoom', ({ roomId, difficulty }) => {
                const initialState: GameState = {
                    roomId,
                    difficulty,
                    players: [],
                    grid: generateInitialGrid(difficulty),
                    foundWords: []
                };

                activeRooms.set(roomId, initialState);
                socket.join(roomId);
                console.log(`Sala creada: ${roomId} (Dificultad: ${difficulty})`);
            });

            socket.on('joinRoom', ({ roomId, player }, callback) => {
                const room = activeRooms.get(roomId);

                if (!room) {
                    callback({ success: false });
                    return;
                }

                if (room.players.length >= 4) {
                    callback({ success: false });
                    return;
                }

                const newPlayer: Player = {
                    ...player,
                    id: socket.id,
                    color: getPlayerColor(room.players.length)
                };

                const updatedState: GameState = {
                    ...room,
                    players: [...room.players, newPlayer]
                };

                activeRooms.set(roomId, updatedState);
                socket.join(roomId);

                io.to(roomId).emit('roomUpdate', updatedState);
                callback({ success: true, state: updatedState });
            });

            socket.on('wordFound', ({ roomId, cells, playerId }) => {
                const room = activeRooms.get(roomId);
                if (!room) return;

                const word = cells
                    .map(([x, y]) => room.grid[y][x].letter)
                    .join('')
                    .toUpperCase();

                if (validateWord(room.difficulty, word)) {
                    const updatedGrid = room.grid.map(row =>
                        row.map(cell => {
                            const isFound = cells.some(([x, y]) => x === cell.x && y === cell.y);
                            return isFound ? { ...cell, foundBy: playerId } : cell;
                        })
                    );

                    const updatedState: GameState = {
                        ...room,
                        grid: updatedGrid,
                        foundWords: [...room.foundWords, word]
                    };

                    activeRooms.set(roomId, updatedState);
                    io.to(roomId).emit('roomUpdate', updatedState);
                }
            });

            socket.on('disconnect', () => {
                activeRooms.forEach((room, roomId) => {
                    const updatedPlayers = room.players.filter(p => p.id !== socket.id);
                    if (updatedPlayers.length === room.players.length) return;

                    if (updatedPlayers.length === 0) {
                        activeRooms.delete(roomId);
                    } else {
                        const updatedState: GameState = { ...room, players: updatedPlayers };
                        activeRooms.set(roomId, updatedState);
                        io.to(roomId).emit('roomUpdate', updatedState);
                    }
                });
            });
        });

        server.io = io;
    }

    return NextResponse.json({ success: true });
}