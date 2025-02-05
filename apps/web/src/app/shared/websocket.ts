// apps/web/src/app/game/shared/infrastructure/websocket.ts
import { io, type Socket } from 'socket.io-client';
import axios from 'axios';
import type { RoomID } from '../types/types';
import { API_URL } from '@wordsearch/config';
import { Difficulty } from '@wordsearch/types';

/**
 * Genera un identificador único para la sala.
 */
export const generateRoomId = (): RoomID => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

let socket: Socket | null = null;

/**
 * Conecta al servidor de WebSocket.
 */
export const connectWebSocket = async (): Promise<Socket> => {
  if (!socket) {
    console.log('Connecting to WebSocket server...');
    socket = io(API_URL, {
      path: '/api/socket', // Usamos el mismo path que configuraremos en el API
      autoConnect: false,
      transports: ['websocket'],
    });
    console.log('Socket created');

    await new Promise<void>((resolve, reject) => {
      socket!.on('connect', resolve).on('connect_error', reject).connect();
    });
  }
  return socket;
};

/**
 * Crea una sala:
 *  - Genera un roomId.
 *  - Solicita al API la generación del grid (enviando difficulty en el body).
 *  - Conecta el WebSocket y emite el evento 'create-room' con los datos.
 *
 * @param difficulty La dificultad seleccionada.
 * @returns Un objeto con el roomId y el grid generado.
 */
export const createRoom = async (
  difficulty: Difficulty,
  topic: string
): Promise<{ roomId: RoomID; grid: string[][] }> => {
  // ✅ Added topic param
  const roomId = generateRoomId();

  console.log('Creating room', roomId);

  // Se envía difficulty y topic en el body para que el API lo reciba correctamente.
  const { data: grid } = await axios.post<string[][]>(
    `${API_URL}/api/game/generate-grid`,
    { difficulty, topic } // ✅ Include topic in request body
  );

  const ws = await connectWebSocket();

  // Se emite el evento 'create-room' con un objeto que contiene roomId, difficulty, grid, y topic.
  ws.emit('create-room', { roomId, difficulty, grid, topic }); // ✅ Include topic in emit data

  return { roomId, grid };
};
