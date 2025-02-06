import { Injectable, Logger } from '@nestjs/common';
import { Difficulty, GameRoom } from '@wordsearch/types';
import * as wordlistsData from '../data/wordlists.json'; // Ajusta la ruta según corresponda

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private activeRooms: Map<string, GameRoom> = new Map();

  // Ejemplo: método para generar grid (puedes adaptar tu algoritmo actual)
  generateGrid(difficulty: Difficulty, topic: string): string[][] {
    const wordlists = wordlistsData as unknown as Record<
      string,
      Record<Difficulty, string[]>
    >;
    if (!(topic in wordlists)) {
      throw new Error('Tema no encontrado');
    }
    if (!(difficulty in wordlists[topic])) {
      throw new Error('Dificultad no encontrada en el tema');
    }
    const words = wordlists[topic][difficulty];
    // Aquí puedes copiar tu lógica actual de generación de grid
    const grid = this._generateGridAlgorithm(difficulty, words);
    this.logger.log(
      `Generated grid for topic ${topic} with difficulty ${difficulty}`
    );
    return grid;
  }

  getWords(topic: string, difficulty: Difficulty): string[] {
    const wordlists = wordlistsData as unknown as Record<
      string,
      Record<Difficulty, string[]>
    >;
    if (!(topic in wordlists)) {
      throw new Error('Tema no encontrado');
    }
    if (!(difficulty in wordlists[topic])) {
      throw new Error('Dificultad no encontrada en el tema');
    }
    return wordlists[topic][difficulty];
  }

  getTopics(): string[] {
    const wordlists = wordlistsData as unknown as Record<
      string,
      Record<Difficulty, string[]>
    >;
    return Object.keys(wordlists);
  }

  getWaitingRooms() {
    // Retorna las salas con estado "waiting"
    return Array.from(this.activeRooms.values())
      .filter((room) => room.status === 'waiting')
      .map(({ id, players, difficulty, topic }) => ({
        id,
        players: players.length,
        difficulty,
        topic,
      }));
  }

  getRoom(id: string): GameRoom | undefined {
    return this.activeRooms.get(id);
  }

  // Ejemplo de algoritmo simple (puedes refinarlo)
  private _generateGridAlgorithm(
    difficulty: Difficulty,
    words: string[]
  ): string[][] {
    const sizes: Record<Difficulty, number> = {
      easy: 10,
      medium: 12,
      hard: 15,
      expert: 18,
      numbers: 10,
    };
    const size = sizes[difficulty];
    const grid: string[][] = Array.from(
      { length: size },
      () => Array(size).fill('') as string[]
    );
    // Lógica simplificada para colocar palabras
    words.forEach((word) => {
      // Intenta colocar la palabra de forma horizontal o vertical
      let placed = false;
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const rowStart = Math.floor(Math.random() * size);
        const colStart = Math.floor(Math.random() * size);
        if (direction === 'horizontal' && colStart + word.length <= size) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[rowStart][colStart + i] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[rowStart][colStart + i] = word[i];
            }
            placed = true;
          }
        } else if (direction === 'vertical' && rowStart + word.length <= size) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[rowStart + i][colStart] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[rowStart + i][colStart] = word[i];
            }
            placed = true;
          }
        }
      }
      if (!placed) {
        this.logger.warn(`No se pudo colocar la palabra: ${word}`);
      }
    });
    // Completar espacios vacíos con letras aleatorias
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          );
        }
      }
    }
    return grid;
  }

  // Puedes agregar métodos para crear, unirse y manejar las salas, según tu lógica original
}
