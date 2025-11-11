import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
    loadComponent: () =>
      import('./dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'matchmaking',
    loadComponent: () => import('./matchmaking/matchmaking.component').then(m => m.MatchmakingComponent),
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
  },
  {
    path: 'arena/:roomId',
    loadComponent: () => import('./pages/arena/scenes/game-scene.component').then(m => m.GameSceneComponent),
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
