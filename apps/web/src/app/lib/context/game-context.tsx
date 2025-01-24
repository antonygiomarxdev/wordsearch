// app/lib/context/game-context.tsx
'use client';

import React, {createContext, useCallback, useContext, useEffect, useReducer, useState} from 'react';
import {io, type Socket} from 'socket.io-client';
import type {Cell, Difficulty, GameAction, GameContextState, GameState, RoomID} from '@/app/game/shared/domain/types';

// 1. Definir tipo del estado incluyendo selectedCells

// 3. Estado inicial completo
const initialGameState: GameContextState = {
    roomId: '',
    difficulty: 'Easy',
    players: [],
    grid: [],
    foundWords: [],
    selectedCells: [],
    error: null
};

// 4. Crear contexto con tipo correcto
const GameContext = createContext<{
    state: GameContextState;
    actions: {
        createRoom: (difficulty: Difficulty) => Promise<void>;
        joinRoom: (roomId: string, playerName: string) => Promise<void>;
        selectCells: (cells: [number, number][]) => void;
        submitSelection: () => void;
        clearError: () => void;
    };
} | null>(null);

// 5. Reducer actualizado
const gameReducer = (state: GameContextState, action: GameAction): GameContextState => {
    switch (action.type) {
        case 'INITIALIZE':
            return { ...initialGameState, ...action.payload };
        case 'UPDATE_STATE':
            return { ...state, ...action.payload };
        case 'SELECT_CELLS':
            return { ...state, selectedCells: action.payload };
        case 'RESET_SELECTION':
            return { ...state, selectedCells: [] };
        case 'ADD_FOUND_WORD':
            return {
                ...state,
                foundWords: [...state.foundWords, action.payload],
                selectedCells: []
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialGameState);
    const [socket, setSocket] = useState<Socket | null>(null);

    // 6. Conexión WebSocket
    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_WS_URL!, {
            path: '/api/socket',
            autoConnect: false,
        });

        newSocket
            .on('connect', () => {
                dispatch({ type: 'SET_ERROR', payload: '' });
            })
            .on('gameUpdate', (newState: GameState) => {
                dispatch({ type: 'UPDATE_STATE', payload: newState });
            })
            .on('error', (error: string) => {
                dispatch({ type: 'SET_ERROR', payload: error });
            });

        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    // 7. Acciones disponibles
    const actions = {
        createRoom: useCallback(async (difficulty: Difficulty) => {
            if (!socket) return;

            socket.emit('createRoom', difficulty, (roomId: RoomID) => {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        ...initialGameState,
                        roomId,
                        difficulty,
                        grid: generateGrid(difficulty),
                    }
                });
                socket.connect();
            });
        }, [socket]),

        joinRoom: useCallback(async (roomId: string, playerName: string) => {
            if (!socket) return;

            socket.emit('joinRoom', roomId, playerName, (success: boolean) => {
                if (success) {
                    socket.connect();
                } else {
                    dispatch({ type: 'SET_ERROR', payload: 'No se pudo unir a la sala' });
                }
            });
        }, [socket]),

        selectCells: useCallback((cells: [number, number][]) => {
            dispatch({ type: 'SELECT_CELLS', payload: cells });
        }, []),

        submitSelection: useCallback(() => {
            if (!socket || !state.roomId || state.selectedCells.length === 0) return;

            const word = state.selectedCells
                .map(([x, y]) => state.grid[y]?.[x]?.letter)
                .join('')
                .toUpperCase();

            socket.emit('submitWord', {
                roomId: state.roomId,
                cells: state.selectedCells,
                word
            });

            dispatch({ type: 'RESET_SELECTION' });
        }, [socket, state.roomId, state.selectedCells, state.grid]),

        clearError: useCallback(() => {
            dispatch({ type: 'SET_ERROR', payload: '' });
        }, []),
    };

    return (
        <GameContext.Provider value={{ state, actions }}>
            {children}
        </GameContext.Provider>
    );
}

// 8. Función para generar grid
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

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext debe usarse dentro de GameProvider');
    }
    return context;
};