import { Cell, Difficulty, Player } from '@wordsearch/types';

export type RoomID = string;

export type GameState = {
  id: RoomID;
  players: Player[];
  grid: Cell[][];
  foundWords: string[];
  difficulty: Difficulty;
  words: string[];
  topic: string;
  status: 'waiting' | 'playing' | 'finished';
  selectedCells: Cell[];
  error: string | null;
};
