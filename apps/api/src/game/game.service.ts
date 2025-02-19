import { Injectable, Logger } from '@nestjs/common';
import { Cell, Difficulty, GameRoom } from '@wordsearch/types';
import * as wordlistsData from '../data/wordlists.json';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private activeRooms: Map<string, GameRoom> = new Map();

  generateGrid(difficulty: Difficulty, topic: string): Cell[][] {
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
    const grid = this.generateGridAlgorithm(difficulty, words);
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

  public createRoom(difficulty: Difficulty, topic: string): GameRoom {
    const id = Math.random().toString(36).substring(7);
    const room: GameRoom = {
      id,
      status: 'waiting',
      difficulty,
      topic,
      players: [],
      grid: this.generateGrid(difficulty, topic),
      words: [],
    };

    this.activeRooms.set(id, room);

    return room;
  }

  public leaveRoom(roomId: string, playerId: string): GameRoom {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status === 'finished') {
      throw new Error('La sala ya ha terminado');
    }

    const playerIndex = room.players.findIndex(
      (player) => player.id === playerId
    );

    if (playerIndex === -1) {
      throw new Error('Jugador no encontrado');
    }

    room.players.splice(playerIndex, 1);

    return room;
  }

  public startGame(roomId: string): GameRoom {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status === 'finished') {
      throw new Error('La sala ya ha terminado');
    }

    room.status = 'playing';

    return room;
  }

  public finishGame(roomId: string): GameRoom {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status === 'finished') {
      throw new Error('La sala ya ha terminado');
    }

    room.status = 'finished';

    return room;
  }

  public updateScore(
    roomId: string,
    playerId: string,
    score: number
  ): GameRoom {
    const room = this.getRoom(roomId);

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status === 'finished') {
      throw new Error('La sala ya ha terminado');
    }

    const player = room.players.find((player) => player.id === playerId);

    if (!player) {
      throw new Error('Jugador no encontrado');
    }

    player.score += score;

    return room;
  }

  public updateRoom(newRoom: Partial<GameRoom>): GameRoom {
    const room = this.getRoom(newRoom.id!);

    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status === 'finished') {
      throw new Error('La sala ya ha terminado');
    }

    this.activeRooms.set(newRoom.id!, newRoom as GameRoom);

    return newRoom as GameRoom;
  }

  private generateGridAlgorithm(
    difficulty: Difficulty,
    words: string[]
  ): Cell[][] {
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

    const directions = [
      { dx: 1, dy: 0 }, // Horizontal derecha
      { dx: 0, dy: 1 }, // Vertical abajo
      { dx: 1, dy: 1 }, // Diagonal abajo-derecha
      { dx: -1, dy: 1 }, // Diagonal abajo-izquierda
    ];

    function canPlaceWord(
      word: string,
      row: number,
      col: number,
      dx: number,
      dy: number
    ): boolean {
      for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;
        if (
          newRow < 0 ||
          newRow >= size ||
          newCol < 0 ||
          newCol >= size ||
          (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i])
        ) {
          return false;
        }
      }
      return true;
    }

    function placeWord(word: string): boolean {
      for (let attempts = 0; attempts < 100; attempts++) {
        const { dx, dy } =
          directions[Math.floor(Math.random() * directions.length)];
        const rowStart = Math.floor(Math.random() * size);
        const colStart = Math.floor(Math.random() * size);

        if (canPlaceWord(word, rowStart, colStart, dx, dy)) {
          for (let i = 0; i < word.length; i++) {
            const newRow = rowStart + i * dy;
            const newCol = colStart + i * dx;
            grid[newRow][newCol] = word[i];
          }
          return true;
        }
      }
      return false;
    }

    words.forEach((word) => placeWord(word));

    // Llenar el resto del grid con letras aleatorias
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === '') {
          grid[row][col] =
            alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    return grid.map((row, y) =>
      row.map((letter, x) => ({
        x,
        y,
        letter,
        foundBy: null,
      }))
    );
  }
}
