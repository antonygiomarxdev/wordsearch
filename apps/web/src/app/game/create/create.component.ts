import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GameService } from '../../services/game.service';
import { TopicSelectorComponent } from './components/topic-selector.component';
import { DifficultySelectorComponent } from './components/difficulty-selector.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

enum CreationStep {
  TOPIC_SELECT,
  DIFFICULTY_SELECT,
  CREATING,
}

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    TopicSelectorComponent,
    DifficultySelectorComponent,
    MatProgressSpinner,
  ],
  templateUrl: `./create.component.html`,
})
export class CreateGameComponent {
  creationStep = CreationStep;
  currentStep: CreationStep = CreationStep.TOPIC_SELECT;
  topics: string[] = [];
  selectedTopic: string | null = null;

  constructor(
    private router: Router,
    private gameService: GameService
  ) {
    // Cargar temas mediante el servicio
    this.gameService.getTopics().subscribe({
      next: (topics) => (this.topics = topics),
      error: (err) => console.error('Error loading topics', err),
    });
  }

  handleTopicSelect(topic: string): void {
    this.selectedTopic = topic;
    this.currentStep = CreationStep.DIFFICULTY_SELECT;
  }

  handleDifficultySelect(difficulty: string): void {
    if (!this.selectedTopic) return;
    this.currentStep = CreationStep.CREATING;
    this.gameService.createRoom(difficulty, this.selectedTopic).subscribe({
      next: (room) => this.router.navigate([`/game/lobby/${room.id}`]),
      error: (err) => {
        console.error('Error creating room', err);
        this.currentStep = CreationStep.DIFFICULTY_SELECT;
      },
    });
  }

  handleGoBackToTopics(): void {
    this.currentStep = CreationStep.TOPIC_SELECT;
  }
}
