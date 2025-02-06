import { Difficulty, Player } from '@wordsearch/types';

export type RoomID = string;

export type Cell = {
  x: number;
  y: number;
  letter: string;
  foundBy: string | null;
  selectedBy?: string[];
};

export type GameState = {
  id: RoomID;
  players: Player[];
  grid: Cell[][];
  foundWords: string[];
  difficulty: Difficulty;
  words: string[];
  topic: string;
  status: 'waiting' | 'playing' | 'finished';
  selectedCells: [number, number][];
  error: string | null;
};
