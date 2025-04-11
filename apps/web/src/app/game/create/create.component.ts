import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { TopicSelectorComponent } from './components/topic-selector.component';
import { DifficultySelectorComponent } from './components/difficulty-selector.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Difficulty } from '@wordsearch/types';
import { GameService } from '../../services/game.service';
import { GameStoreService } from '../../services/game-storage.service';
import { take, tap } from 'rxjs';

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
    MatStepperModule,
    MatIconModule,
    TopicSelectorComponent,
    DifficultySelectorComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: `./create.component.html`,
})
export class CreateGameComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  creationStep = CreationStep;
  currentStep = signal(CreationStep.TOPIC_SELECT);
  selectedTopic = signal<string | null>(null);
  topics = signal<string[]>([]);
  private router = inject(Router);
  private gameStore = inject(GameStoreService);
  private gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService
      .getTopics()
      .pipe(
        take(1),
        tap(({ topics }) => {
          console.log('Received topics', { topics });
          this.topics.set(topics);
        })
      )
      .subscribe();
  }

  handleTopicSelect(topic: string): void {
    this.selectedTopic.set(topic);
    this.currentStep.set(CreationStep.DIFFICULTY_SELECT);
    this.stepper.next();
  }

  handleDifficultySelect(difficulty: Difficulty): void {
    if (!this.selectedTopic()) {
      console.error('No topic selected');
      return;
    }

    this.currentStep.set(CreationStep.CREATING);
    this.stepper.next();
    console.log('Creating room with', difficulty, this.selectedTopic());

    // 🔹 Crea la sala y la almacena en `GameStoreService`
    this.gameStore.createRoom(difficulty, this.selectedTopic()!);

    // 🔹 Reactivamente observa si la sala fue creada y redirige
    const newRoomSignal = computed(() => this.gameStore.gameState()?.id);

    if (newRoomSignal()) {
      this.router.navigate([`/game/play/${newRoomSignal()}`]);
    }
  }

  handleGoBackToTopics(): void {
    this.currentStep.set(CreationStep.TOPIC_SELECT);
    this.stepper.previous();
  }
}
