import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Difficulty } from '@wordsearch/types';

interface DifficultyItem {
  name: Difficulty;
  color: string;
  description: string;
}

@Component({
  selector: 'app-difficulty-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        *ngFor="let diff of difficulties"
        (click)="onDifficultySelect(diff.name)"
        [ngClass]="
          diff.color +
          ' text-white p-6 rounded-lg shadow-md transition-all duration-300 w-full text-left flex flex-col justify-between h-32'
        "
      >
        <h3 class="text-xl font-bold">{{ diff.name }}</h3>
        <p class="text-sm opacity-90">{{ diff.description }}</p>
      </button>
    </div>
  `,
})
export class DifficultySelectorComponent {
  @Output() difficultySelect = new EventEmitter<Difficulty>();

  difficulties: DifficultyItem[] = [
    {
      name: 'easy',
      color: 'bg-green-500 hover:bg-green-600',
      description: '10x10 grid - Palabras simples',
    },
    {
      name: 'medium',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: '12x12 grid - Términos técnicos',
    },
    {
      name: 'hard',
      color: 'bg-red-500 hover:bg-red-600',
      description: '15x15 grid - Vocabulario avanzado',
    },
    {
      name: 'expert',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '18x18 grid - Desafío extremo',
    },
    {
      name: 'numbers',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '10x10 grid - Combinaciones numéricas',
    },
  ];

  onDifficultySelect(diff: Difficulty): void {
    this.difficultySelect.emit(diff);
  }
}
