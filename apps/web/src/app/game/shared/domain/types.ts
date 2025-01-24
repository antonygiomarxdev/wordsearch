export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Numbers';
export type RoomID = string;

export type GameState = {
    roomId: RoomID;
    players: Player[];
    grid: Cell[][];
    foundWords: string[];
    difficulty: Difficulty;
};

export interface Player {
    id: string;
    name: string;
    color: string;
    foundWords: string[];
}

export type Cell = {
    x: number;
    y: number;
    letter: string;
    foundBy: string | null;
};

export type GameContextState = GameState & {
    selectedCells: [number, number][];
    error: string | null;
};

export type GameAction =
    | { type: 'INITIALIZE'; payload: GameState }
    | { type: 'UPDATE_STATE'; payload: Partial<GameState> }
    | { type: 'SELECT_CELLS'; payload: [number, number][] }
    | { type: 'RESET_SELECTION' }
    | { type: 'ADD_FOUND_WORD'; payload: string }
    | { type: 'SET_ERROR'; payload: string };
