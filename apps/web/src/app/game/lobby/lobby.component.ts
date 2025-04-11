import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './lobby.component.html',
})
export class LobbyComponent implements OnInit {
  roomId: string = '';
  playerName: string = '';

  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private socketService = inject(SocketService);

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    this.playerName = this.route.snapshot.paramMap.get('playerName') || '';

    this.socketService.on('room-update').subscribe((room) => {
      console.log('LobbyComponent.room-update', room);
    });

    this.socketService.on('join-success').subscribe(() => {
      console.log('LobbyComponent.join-success');

      this.router.navigate(['/game/play', this.roomId, this.playerName]);

      this.snackBar.open('Joined room', 'Close', {
        duration: 3000,
      });
    });
  }

  handleOnJoinRoom(): void {
    this.socketService.on('join-error').subscribe((error) => {
      console.error('LobbyComponent.join-error', error);

      this.snackBar.open(
        error instanceof Error ? error.message : 'Error joining room',
        'Close',
        {
          duration: 3000,
        }
      );
    });

    this.socketService.on('join-success').subscribe(() => {
      console.log('LobbyComponent.join-success');

      this.router.navigate(['/game/play', this.roomId, this.playerName]);

      this.snackBar.open('Joined room', 'Close', {
        duration: 3000,
      });
    });

    this.socketService.emit('join-room', {
      roomId: this.roomId,
      playerName: this.playerName,
    });
  }

  async copyRoomId(): Promise<void> {
    await navigator.clipboard.writeText(this.roomId);
    this.snackBar.open('Room ID copied to clipboard', 'Close', {
      duration: 3000,
    });
  }
}
