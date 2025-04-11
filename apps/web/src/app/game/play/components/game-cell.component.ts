import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '@wordsearch/types';

@Component({
  selector: 'app-game-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center justify-center border border-gray-300 rounded cursor-pointer select-none relative"
      (mousedown)="onSelectStart()"
      (mouseup)="onSelectEnd()"
      (mouseenter)="onSelectEnter()"
      (touchstart)="onSelectStart()"
      (touchend)="onSelectEnd()"
      [ngStyle]="backgroundStyle()"
    >
      <span class="text-lg font-bold">{{ cell()?.letter }}</span>
    </div>
  `,
})
export class GameCellComponent {
  cell = input<Cell | null | undefined>(null);

  selectStart = output<[number, number]>();
  selectEnter = output<[number, number]>();
  selectEnd = output<void>();

  backgroundStyle = () => ({
    backgroundColor: this.cell()?.foundBy ? '#a0aec0' : '#ffffff',
  });

  onSelectStart(): void {
    const cellValue = this.cell();
    if (!cellValue) {
      console.log('GameCellComponent.onSelectStart: cell is null');
      return;
    }

    const x = cellValue.x ?? -1;
    const y = cellValue.y ?? -1;

    if (x < 0 || y < 0) {
      console.log('GameCellComponent.onSelectStart: invalid cell coordinates');
      return;
    }

    this.selectStart.emit([x, y]);
  }

  onSelectEnter(): void {
    const cellValue = this.cell();
    if (!cellValue) {
      console.log('GameCellComponent.onSelectEnter: cell is null');
      return;
    }

    const x = cellValue.x ?? -1;
    const y = cellValue.y ?? -1;

    if (x < 0 || y < 0) {
      console.log('GameCellComponent.onSelectEnter: invalid cell coordinates');
      return;
    }

    this.selectEnter.emit([x, y]);
  }

  onSelectEnd(): void {
    this.selectEnd.emit();
  }
}
