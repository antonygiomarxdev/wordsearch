export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'numbers';

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface GameRoom {
  id: string;
  players: Player[];
  difficulty: Difficulty;
  grid: string[][];
  words: string[];
  status: 'waiting' | 'playing' | 'finished';
  topic: string;
}
