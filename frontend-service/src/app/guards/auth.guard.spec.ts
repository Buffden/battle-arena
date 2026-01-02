import { AuthGuard } from './auth.guard';
import { setupGuardTestBed } from './guards-test-utils';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<import('../services/auth.service').AuthService>;
  let router: jasmine.SpyObj<import('@angular/router').Router>;
  let route: import('@angular/router').ActivatedRouteSnapshot;
  let state: import('@angular/router').RouterStateSnapshot;

  beforeEach(() => {
    const setup = setupGuardTestBed(AuthGuard);
    guard = setup.guard as AuthGuard;
    authService = setup.authService as jasmine.SpyObj<
      import('../services/auth.service').AuthService
    >;
    router = setup.router as jasmine.SpyObj<import('@angular/router').Router>;
    route = setup.route as import('@angular/router').ActivatedRouteSnapshot;
    state = setup.state as import('@angular/router').RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should check authentication state before allowing access', () => {
    authService.isAuthenticated.and.returnValue(true);

    guard.canActivate(route, state);

    expect(authService.isAuthenticated).toHaveBeenCalled();
  });
});
