import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  // Login and register are handled via modals, not separate routes
  // This route file is kept for future routing needs if required
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
