// src/app/game/lobby/lobby.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './lobby.component.html',
})
export class LobbyComponent implements OnInit {
  roomId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    this.gameService.subscribeToRoomUpdates(this.roomId);
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.roomId);
  }
}
