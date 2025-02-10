export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'numbers';

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export type Cell = {
  x: number;
  y: number;
  letter: string;
  foundBy: string | null;
  selectedBy?: Player[];
};

export interface GameRoom {
  id: string;
  players: Player[];
  difficulty: Difficulty;
  grid: Cell[][];
  words: string[];
  status: 'waiting' | 'playing' | 'finished';
  topic: string;
}

export type EventTypes = 'join' | 'start' | 'select' | 'finish' | 'score';
