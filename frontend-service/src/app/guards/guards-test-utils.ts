import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Test utilities for guard testing.
 *
 * <p>
 * Provides shared setup and mock creation for guard unit tests.
 * Reduces code duplication across guard test files.
 * </p>
 *
 * <p>
 * Design Pattern: Test Utility Pattern - Shared test setup code
 * </p>
 */
export interface GuardTestSetup {
  authService: jasmine.SpyObj<AuthService>;
  router: jasmine.SpyObj<Router>;
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

/**
 * Sets up common test configuration for guard tests.
 *
 * @param guardClass The guard class to provide in TestBed
 * @return Test setup with mocked services and route snapshots
 */
export function setupGuardTestBed<T>(
  guardClass: new (...args: any[]) => T
): GuardTestSetup & { guard: T } {
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  TestBed.configureTestingModule({
    providers: [
      guardClass,
      { provide: AuthService, useValue: authServiceSpy },
      { provide: Router, useValue: routerSpy }
    ]
  });

  const guard = TestBed.inject(guardClass);
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  return {
    guard,
    authService: authServiceSpy,
    router: routerSpy,
    route,
    state
  };
}
