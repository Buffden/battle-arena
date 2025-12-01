import { WildcardGuard } from './wildcard.guard';
import { setupGuardTestBed } from './guards-test-utils';

describe('WildcardGuard', () => {
  let guard: WildcardGuard;
  let authService: jasmine.SpyObj<import('../services/auth.service').AuthService>;
  let router: jasmine.SpyObj<import('@angular/router').Router>;
  let route: import('@angular/router').ActivatedRouteSnapshot;
  let state: import('@angular/router').RouterStateSnapshot;

  beforeEach(() => {
    const setup = setupGuardTestBed(WildcardGuard);
    guard = setup.guard;
    authService = setup.authService;
    router = setup.router;
    route = setup.route;
    state = setup.state;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect authenticated users to dashboard', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect unauthenticated users to landing page', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should check authentication state before redirecting', () => {
    authService.isAuthenticated.and.returnValue(true);

    guard.canActivate(route, state);

    expect(authService.isAuthenticated).toHaveBeenCalled();
  });
});
