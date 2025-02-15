import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as types from '../../types/types';

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
      [ngStyle]="backgroundStyle"
    >
      <span class="text-lg font-bold">{{ cell.letter }}</span>
    </div>
  `,
})
export class GameCellComponent {
  @Input() cell!: types.Cell;
  @Input() isSelected: boolean = false;
  @Output() selectStart = new EventEmitter<[number, number]>();
  @Output() selectEnter = new EventEmitter<[number, number]>();
  @Output() selectEnd = new EventEmitter<void>();

  get backgroundStyle(): { [key: string]: string } {
    if (this.isSelected) {
      return { backgroundColor: '#bfdbfe' };
    } else if (this.cell.foundBy) {
      return { backgroundColor: '#a0aec0' };
    }
    return { backgroundColor: '#ffffff' };
  }

  onSelectStart(): void {
    this.selectStart.emit([this.cell.x, this.cell.y]);
  }
  onSelectEnter(): void {
    this.selectEnter.emit([this.cell.x, this.cell.y]);
  }
  onSelectEnd(): void {
    this.selectEnd.emit();
  }
}
