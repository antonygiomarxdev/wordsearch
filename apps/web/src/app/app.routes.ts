import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'game/create',
    loadComponent: () =>
      import('./game/create/create.component').then(
        (m) => m.CreateGameComponent
      ),
  },
  {
    path: 'game/join',
    loadComponent: () =>
      import('./game/join/join.component').then((m) => m.JoinGameComponent),
  },
  {
    path: 'game/lobby/:roomId',
    loadComponent: () =>
      import('./game/lobby/lobby.component').then((m) => m.LobbyComponent),
  },
  {
    path: 'game/play/:roomId',
    loadComponent: () =>
      import('./game/play/play.component').then((m) => m.PlayGameComponent),
  },
  {
    path: 'game',
    component: GameComponent,
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./error/error.component').then((m) => m.ErrorComponent),
  },
  { path: '**', redirectTo: '' },
];
