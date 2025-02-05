import axios from 'axios';
import { API_URL } from '@wordsearch/config';
import type { Difficulty, GameRoom } from '@wordsearch/types';
import { useGameContext } from '../game/context/game-context';

interface CreateRoomPayload {
  difficulty: Difficulty;
  grid: string[][]; // Obtenido del API
  topic: string;
  words: string[]; // Lista de palabras para la sala (ajústalo según tu lógica)
  creatorName: string;
}

/**
 * Hook que encapsula las acciones para crear y unirse a salas de juego.
 *
 * Se devuelve un objeto con dos métodos:
 * - createRoom: Crea una sala de juego.
 * - joinRoom: Permite a un jugador unirse a una sala existente.
 */
export function useGameRoomActions(): {
  createRoom: (difficulty: Difficulty, topic: string, creatorName: string) => Promise<GameRoom>;
  joinRoom: (roomId: string, playerName: string) => Promise<GameRoom>;
} {
  const { webSocketService } = useGameContext();

  const createRoom = async (difficulty: Difficulty, topic: string, creatorName: string): Promise<GameRoom> => {
    // Se solicita el grid al API.
    const { data: grid } = await axios.post<string[][]>(`${API_URL}/api/game/generate-grid`, { difficulty, topic });
    // Define o extrae la lista de palabras según tu lógica.
    const words: string[] = [];

    return new Promise<GameRoom>((resolve, reject) => {
      const payload: CreateRoomPayload = {
        difficulty,
        grid,
        topic,
        words,
        creatorName,
      };
      // Se emite el evento 'create-room'; el backend generará el ID y agregará al creador.
      webSocketService.emit('create-room', payload, (room: GameRoom) => {
        if (room) {
          resolve(room);
        } else {
          reject(new Error('Failed to create room'));
        }
      });
    });
  };

  const joinRoom = async (roomId: string, playerName: string): Promise<GameRoom> => {
    return new Promise<GameRoom>((resolve, reject) => {
      webSocketService.emit('join-room', roomId, playerName, (room: GameRoom | null) => {
        if (room) {
          resolve(room);
        } else {
          reject(new Error('Failed to join room or room not found'));
        }
      });
    });
  };

  return {
    createRoom,
    joinRoom,
  };
}
