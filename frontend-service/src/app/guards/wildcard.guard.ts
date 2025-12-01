import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard for wildcard routes (404 handling).
 *
 * <p>
 * Redirects authenticated users to dashboard, unauthenticated users to landing page.
 * This provides a better UX than showing a 404 page.
 * </p>
 *
 * <p>
 * Design Pattern: Guard Pattern - Route protection with smart redirects
 * </p>
 */
@Injectable({
  providedIn: 'root'
})
export class WildcardGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    // If authenticated, redirect to dashboard; otherwise, redirect to landing page
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
    return false;
  }
}
