import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  // TODO: Create login and register components
  // {
  //   path: 'login',
  //   loadComponent: () => import('../components/auth/login/login.component').then(m => m.LoginComponent)
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('../components/auth/register/register.component').then(m => m.RegisterComponent)
  // },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
