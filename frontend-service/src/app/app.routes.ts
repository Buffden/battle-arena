import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  // TODO: Add routes based on component design documentation
  {
    path: '**',
    redirectTo: ''
  }
];
