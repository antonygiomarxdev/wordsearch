import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameGridComponent } from './components/game-grid.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cell } from '@wordsearch/types';
import { GameStoreService } from '../../services/game-storage.service';

@Component({
  selector: 'app-play-game',
  standalone: true,
  imports: [CommonModule, GameGridComponent],
  template: `
    <ng-container *ngIf="hasValidGrid()">
      <app-game-grid
        [grid]="gameStore.grid()"
        (selectionCompleted)="onSelectionCompleted($event)"
      ></app-game-grid>
    </ng-container>
    <div *ngIf="!hasValidGrid()" class="loading-container">
      <p>Cargando juego...</p>
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 5px;
        padding: 10px;
        background-color: #e0e0e0;
        border: 2px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .grid-row {
        display: contents;
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .border {
        border: 1px solid #ccc;
        border-radius: 4px;
        transition:
          background-color 0.3s,
          transform 0.3s;
        background-color: #ffffff;
      }

      .cursor-pointer {
        cursor: pointer;
      }

      .select-none {
        user-select: none;
      }

      .relative {
        position: relative;
      }

      .cell-selected {
        background-color: #a0aec0;
      }

      .cell-hover {
        background-color: #e2e8f0;
      }

      .text-lg {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }
    `,
  ],
})
export class PlayGameComponent implements OnInit {
  gameStore = inject(GameStoreService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hasValidGrid = computed(() => {
    const grid = this.gameStore.grid();
    return grid && grid.length > 0 && grid[0] && grid[0].length > 0;
  });

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId') ?? '';
    const playerName = this.route.snapshot.paramMap.get('playerName') ?? '';

    this.gameStore.roomId.set(roomId);
    this.gameStore.playerName.set(playerName);

    this.gameStore.loadRoom(roomId);
  }

  onSelectionCompleted(selectedCells: Cell[]): void {
    if (!selectedCells || selectedCells.length === 0) {
      console.log('No se seleccionaron celdas válidas');
      return;
    }

    console.log('Palabra seleccionada:', selectedCells);
    this.gameStore.selectCells(selectedCells);
    this.gameStore.submitSelection();
  }

  copyRoomCode(): void {
    navigator.clipboard.writeText(this.gameStore.roomId());
    this.snackBar.open(
      `Código de sala copiado: ${this.gameStore.roomId()}`,
      'Cerrar',
      { duration: 3000 }
    );
  }
}
