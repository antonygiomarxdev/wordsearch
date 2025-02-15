// src/app/game/play-game/play-game.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameGridComponent } from './components/game-grid.component';
import { WordListComponent } from './components/word-list.component';

@Component({
  selector: 'app-play-game',
  standalone: true,
  imports: [CommonModule, GameGridComponent, WordListComponent],
  templateUrl: './play.component.html',
})
export class PlayGameComponent implements OnInit {
  roomId: string = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    this.gameService.subscribeToRoomUpdates(this.roomId);
  }
}
