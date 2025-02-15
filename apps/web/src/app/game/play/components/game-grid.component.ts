import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCellComponent } from './game-cell.component';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-game-grid',
  standalone: true,
  imports: [CommonModule, GameCellComponent],
  template: `
    <div
      *ngIf="gameState.grid?.length; else loading"
      class="bg-gray-100 p-4 rounded shadow-md"
    >
      <div
        *ngFor="let row of gameState.grid; let y = index"
        class="grid gap-1 mb-1"
        [ngStyle]="{
          'grid-template-columns':
            'repeat(' + row.length + ', minmax(40px, 1fr))',
        }"
      >
        <app-game-cell
          *ngFor="let cell of row; let x = index"
          [cell]="cell"
          [isSelected]="isCellSelected(x, y)"
          (selectStart)="handleSelectStart([x, y])"
          (selectEnter)="handleSelectEnter([x, y])"
          (selectEnd)="handleSelectEnd()"
        >
        </app-game-cell>
      </div>
    </div>
    <ng-template #loading>
      <p class="flex items-center justify-center h-96 text-gray-500">
        Cargando grid...
      </p>
    </ng-template>
  `,
})
export class GameGridComponent {
  constructor(private gameService: GameService) {}

  get gameState() {
    return this.gameService.getGameState();
  }

  isCellSelected(x: number, y: number): boolean {
    return this.gameService
      .getGameState()
      .selectedCells.some(([cx, cy]) => cx === x && cy === y);
  }

  handleSelectStart(position: [number, number]): void {
    this.gameService.selectCells([position]);
  }

  handleSelectEnter(position: [number, number]): void {
    if (this.gameService.getGameState().selectedCells.length === 0) return;
    const start = this.gameService.getGameState().selectedCells[0];
    const cells = this.getCellsBetween(start, position);
    this.gameService.selectCells(cells);
  }

  handleSelectEnd(): void {
    this.gameService.submitSelection();
  }

  getCellsBetween(
    start: [number, number],
    end: [number, number]
  ): [number, number][] {
    let [x0, y0] = start;
    const [x1, y1] = end;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    const cells: [number, number][] = [];
    while (true) {
      cells.push([x0, y0]);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    return cells;
  }
}
