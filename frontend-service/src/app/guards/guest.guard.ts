import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard for guest-only routes (login, register, landing page).
 *
 * <p>
 * Redirects authenticated users away from guest routes (like landing page) to dashboard.
 * This prevents authenticated users from seeing login/register pages.
 * </p>
 *
 * <p>
 * Design Pattern: Guard Pattern - Route protection with reverse logic
 * </p>
 */
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    // If authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Allow access to guest routes if not authenticated
    return true;
  }
}
