import { routes } from './app.routes';

describe('App Routes', () => {
  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have all required route configurations', () => {
    // Check that landing page route exists
    const landingRoute = routes.find(r => r.path === '');
    expect(landingRoute).toBeDefined();
    expect(landingRoute?.canActivate).toBeDefined();

    // Check that dashboard route exists
    const dashboardRoute = routes.find(r => r.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.canActivate).toBeDefined();

    // Check that wildcard route exists (redirects to landing page)
    const wildcardRoute = routes.find(r => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('');
  });
});
