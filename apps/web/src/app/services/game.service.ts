import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { GameRoom } from '@wordsearch/types';
import { Cell, GameState, RoomID } from '../game/types/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameStateSubject = new BehaviorSubject<GameState>({
    id: '',
    players: [],
    grid: [],
    foundWords: [],
    difficulty: 'easy',
    words: [],
    topic: '',
    status: 'waiting',
    selectedCells: [],
    error: null,
  });

  gameState$: Observable<GameState> = this.gameStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  getGameState(): GameState {
    return this.gameStateSubject.value;
  }

  updateGameState(newState: Partial<GameState>): void {
    this.gameStateSubject.next({ ...this.getGameState(), ...newState });
  }

  getTopics(): Observable<string[]> {
    return this.http
      .get<{ topics: string[] }>(`${environment.apiUrl}/api/game/topics`)
      .pipe(
        tap((response) => console.log('Loaded topics', response.topics)),
        map((response) => response.topics)
      );
  }

  createRoom(difficulty: string, topic: string): Observable<GameRoom> {
    return this.http
      .post<GameRoom>(`${environment.apiUrl}/api/game/generate-grid`, {
        difficulty,
        topic,
      })
      .pipe(
        tap((room) => {
          this.updateGameState({
            selectedCells: [],
            id: room.id,
            players: room.players,
            grid: room.grid.map((row, y) =>
              row.map((letter, x) => ({ x, y, letter, foundBy: null }))
            ) as Cell[][],
            words: room.words,
            difficulty: room.difficulty,
            topic: room.topic,
            status: room.status,
          });
        })
      );
  }

  joinRoom(roomId: RoomID, playerName: string): Observable<GameRoom> {
    return this.http
      .post<GameRoom>(`${environment.apiUrl}/api/game/join`, {
        roomId,
        playerName,
      })
      .pipe(
        tap((room) => {
          this.updateGameState({
            id: room.id,
            players: room.players,
            grid: room.grid.map((row, y) =>
              row.map((letter, x) => ({ x, y, letter, foundBy: null }))
            ) as Cell[][],
            words: room.words,
            difficulty: room.difficulty,
            topic: room.topic,
            status: room.status,
          });
        })
      );
  }

  subscribeToRoomUpdates(roomId: RoomID): void {
    console.log('Subscribing to room updates for room', roomId);
    // Aquí implementarías la lógica real para suscribirte a actualizaciones vía WebSocket.
  }

  selectCells(cells: [number, number][]): void {
    this.updateGameState({ selectedCells: cells });
  }

  submitSelection(): void {
    console.log('Submitting selection:', this.getGameState().selectedCells);
    // Aquí deberías validar la palabra seleccionada, actualizar el estado y notificar a otros jugadores vía WebSocket.
    this.updateGameState({ selectedCells: [] });
  }
}
