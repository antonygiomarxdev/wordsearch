import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-word-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full md:w-80 bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4 text-gray-700">
        Palabras encontradas ({{ foundWords.length }}) / por encontrar ({{
          remainingWords.length
        }})
      </h2>
      <div class="space-y-2">
        <div
          *ngFor="let word of foundWords"
          class="flex items-center bg-green-50 p-2 rounded"
        >
          <span class="flex-1 text-gray-700 font-medium">{{ word }}</span>
        </div>
        <div
          *ngFor="let word of remainingWords"
          class="flex items-center p-2 rounded bg-gray-50 opacity-50"
        >
          <span class="flex-1 text-gray-400 font-medium">{{ word }}</span>
          <span class="text-xs text-gray-400 ml-2">Por encontrar</span>
        </div>
      </div>
    </div>
  `,
})
export class WordListComponent {
  constructor(private gameService: GameService) {}

  get remainingWords(): string[] {
    return this.gameService.getGameState().words;
  }

  get foundWords(): string[] {
    return this.gameService.getGameState().foundWords;
  }
}
