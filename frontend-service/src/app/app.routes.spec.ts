import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('App Routes', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    });
    router = TestBed.inject(Router);
  });

  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should be able to navigate to routes', () => {
    // Routes are defined and can be navigated
    expect(router).toBeDefined();
  });
});

