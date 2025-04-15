import {
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { GameService } from './game.service';
import { Cell, Difficulty, GameRoom } from '@wordsearch/types';
import { GameState, RoomID } from '../game/types/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class GameStoreService {
  roomId: WritableSignal<string> = signal('');
  playerName: WritableSignal<string> = signal('');
  gameState: WritableSignal<GameState | null> = signal(null);
  grid: WritableSignal<Cell[][]> = signal([]);
  private gameService = inject(GameService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const state = this.gameState();
      if (state) {
        this.grid.set(state.grid ?? []);
      }
    });
  }

  loadRoom(roomId: RoomID): void {
    this.roomId.set(roomId);

    this.gameService
      .getRoom(roomId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((gameRoom) => {
        if (gameRoom) {
          this.gameState.set(this.mapGameRoomToGameState(gameRoom));
        }
      });

    this.gameService.subscribeToRoomUpdates(roomId, (game: GameRoom) => {
      if (game) {
        this.gameState.set(this.mapGameRoomToGameState(game));
      }
    });
  }

  createRoom(difficulty: Difficulty, topic: string): void {
    this.gameService
      .createRoom(difficulty, topic)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((roomSignal) => {
        if (roomSignal) {
          this.gameState.set(this.mapGameRoomToGameState(roomSignal));
          this.roomId.set(roomSignal.id);
        }
      });
  }

  selectCells(cells: Cell[]): void {
    const currentState = this.gameState();
    if (!currentState) return;

    const updatedGameState: GameState = {
      ...currentState,
      selectedCells: cells,
    };

    this.gameState.set(updatedGameState);
  }

  submitSelection(): void {
    console.log('Submitting selection:', this.gameState()?.selectedCells);
    this.selectCells([]);
  }

  private mapGameRoomToGameState(gameRoom: GameRoom): GameState {
    return {
      id: gameRoom.id,
      players: gameRoom.players ?? [],
      grid: gameRoom.grid ?? [],
      foundWords: [],
      difficulty: gameRoom.difficulty,
      words: gameRoom.words ?? [],
      topic: gameRoom.topic,
      status: gameRoom.status,
      selectedCells: [],
      error: null,
    };
  }
}
