import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GameCellComponent } from './game-cell.component';
import { Cell } from '@wordsearch/types';

@Component({
  selector: 'app-game-grid',
  standalone: true,
  imports: [CommonModule, DragDropModule, GameCellComponent],
  template: `
    <div class="grid-container">
      <div *ngFor="let row of grid(); let y = index" class="grid-row">
        <app-game-cell
          *ngFor="let cell of row; let x = index"
          [cell]="cell"
          (selectStart)="handleSelectStart([x, y])"
          (selectEnter)="handleSelectEnter([x, y])"
          (selectEnd)="handleSelectEnd()"
        >
        </app-game-cell>
      </div>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: grid;
        grid-template-columns: repeat(
          10,
          1fr
        ); /* Ajusta según el tamaño del grid */
        gap: 5px; /* Espaciado entre celdas */
        padding: 10px; /* Espaciado interno del contenedor */
        background-color: #e0e0e0; /* Color de fondo del grid */
        border: 2px solid #ccc; /* Borde del grid */
        border-radius: 8px; /* Bordes redondeados */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidad */
      }

      .grid-row {
        display: contents; /* Permite que las filas se comporten como un contenedor de grid */
      }
    `,
  ],
})
export class GameGridComponent {
  grid = input.required<Cell[][]>();

  selectionCompleted = output<Cell[]>();

  selectedCells = signal<Cell[]>([]);
  selecting = signal(false);
  startPos = signal<[number, number] | null>(null);
  direction = signal<{ dx: number; dy: number } | null>(null);

  handleSelectStart(position: [number, number]) {
    if (!this.isValidPosition(position)) {
      console.log('GameGridComponent.handleSelectStart: invalid position');
      return;
    }

    this.selecting.set(true);
    this.startPos.set(position);

    const cell = this.getCell(position);

    if (!cell) {
      console.log('GameGridComponent.handleSelectStart: cell is null');
      return;
    }

    this.selectedCells.set([cell]);
  }

  handleSelectEnter(position: [number, number]) {
    if (!this.selecting() || !this.startPos()) return;
    if (!this.isValidPosition(position)) return;

    const start = this.startPos()!;
    if (!this.direction()) {
      this.direction.set(this.getDirection(start, position));
    }

    this.selectedCells.set(this.getCellsInDirection(start, position));
  }

  handleSelectEnd() {
    this.selecting.set(false);
    this.startPos.set(null);
    this.direction.set(null);
    this.selectionCompleted.emit(this.selectedCells());
  }

  isValidPosition(position: [number, number]): boolean {
    const [x, y] = position;
    const gridValue = this.grid();
    return (
      gridValue &&
      y >= 0 &&
      y < gridValue.length &&
      x >= 0 &&
      x < gridValue[y].length
    );
  }

  getCell(position: [number, number]): Cell | undefined {
    if (!this.isValidPosition(position)) return undefined;

    const [x, y] = position;
    return this.grid()[y][x];
  }

  getDirection(start: [number, number], end: [number, number]) {
    const [x0, y0] = start;
    const [x1, y1] = end;
    return {
      dx: x1 > x0 ? 1 : x1 < x0 ? -1 : 0,
      dy: y1 > y0 ? 1 : y1 < y0 ? -1 : 0,
    };
  }

  getCellsInDirection(start: [number, number], end: [number, number]): Cell[] {
    const startCell = this.getCell(start);

    if (!startCell) {
      console.log('GameGridComponent.getCellsInDirection: startCell is null');
      return [];
    }

    if (!this.direction()) return [startCell];

    const { dx, dy } = this.direction()!;
    let [x, y] = start;

    const cells: Cell[] = [];
    const gridValue = this.grid();

    // Agregar la primera celda
    if (this.isValidPosition([x, y])) {
      const cell = this.getCell([x, y]);
      if (cell) cells.push(cell);
    }

    // Recorrer en la dirección hasta encontrar el punto final
    while (x !== end[0] || y !== end[1]) {
      x += dx;
      y += dy;

      if (!this.isValidPosition([x, y])) break;

      const cell = this.getCell([x, y]);
      if (cell) cells.push(cell);
    }

    return cells;
  }
}
