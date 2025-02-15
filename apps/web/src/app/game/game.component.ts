import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-create',
  imports: [MatButton],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  constructor(private router: Router) {}
  handleCreate(): void {
    this.router.navigate(['/game/create']);
  }
  handleJoin(): void {
    this.router.navigate(['/game/join']);
  }
}
