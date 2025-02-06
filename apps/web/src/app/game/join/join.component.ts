import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-join-game',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './join.component.html',
})
export class JoinGameComponent {
  roomCode: string = '';
  playerName: string = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private gameService: GameService
  ) {}

  handleJoin(): void {
    if (!this.roomCode || !this.playerName) {
      this.snackBar.open('Complete todos los campos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    this.gameService
      .joinRoom(this.roomCode.toUpperCase(), this.playerName)
      .subscribe({
        next: (room) => this.router.navigate([`/game/play/${room.id}`]),
        error: (err) => {
          console.error('Error al unirse a la sala', err);
          this.snackBar.open('Error al unirse a la sala', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/game']);
  }
}
