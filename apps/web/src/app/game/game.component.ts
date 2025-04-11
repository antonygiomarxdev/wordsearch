import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-create',
  imports: [MatButton],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  router = inject(Router);

  public async handleCreate(): Promise<void> {
    await this.router.navigate(['/game/create']);
  }

  public async handleJoin(): Promise<void> {
    await this.router.navigate(['/game/join']);
  }
}
