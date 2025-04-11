import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-join-game',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './join.component.html',
})
export class JoinGameComponent {
  roomCode: string = '';
  playerName: string = '';

  router = inject(Router);
  snackBar = inject(MatSnackBar);
  gameService = inject(GameService);
  socketService = inject(SocketService);

  handleJoin(): void {
    if (!this.roomCode || !this.playerName) {
      this.snackBar.open('Complete todos los campos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.socketService.emit('join-room', {
      roomId: this.roomCode,
      playerName: this.playerName,
    });

    this.socketService.on('join-error').subscribe((error) => {
      console.error('JoinGameComponent.join-error', error);

      this.snackBar.open(
        error instanceof Error ? error.message : 'Error al unirse a la sala',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    });

    this.socketService.on('join-success').subscribe(() => {
      console.log('JoinGameComponent.join-success');

      this.router.navigate(['/game/play', this.roomCode]);

      this.snackBar.open('Unido a la sala', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  async goBack(): Promise<void> {
    await this.router.navigate(['/game']);
  }
}
