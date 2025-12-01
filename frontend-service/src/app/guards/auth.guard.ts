import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard for authentication protection.
 *
 * <p>
 * Protects routes by checking authentication state. Redirects unauthenticated
 * users to the landing page (login).
 * </p>
 *
 * <p>
 * Design Pattern: Guard Pattern - Route protection and access control
 * </p>
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to landing page (login) if not authenticated
    this.router.navigate(['/']);
    return false;
  }
}
