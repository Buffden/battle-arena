import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { RegisterRequest, RegisterResponse, LoginRequest, AuthResponse } from '../types/auth.types';

/**
 * Helper function to create a JWT token with custom expiration.
 * Format: header.payload.signature (we only need valid payload)
 */
function createMockJWT(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
  const encodedPayload = btoa(JSON.stringify(payload))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
  const signature = 'mock-signature';
  return `${header}.${encodedPayload}.${signature}`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/auth';

  const TEST_VALID_PASSWORD = 'TestPassword123'; // Test-only password for validation testing // NOSONAR
  const TEST_VALID_USERNAME = 'testuser';
  const TEST_VALID_EMAIL = 'test@example.com';

  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: mockRouter }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('register()', () => {
    const registerRequest: RegisterRequest = {
      username: TEST_VALID_USERNAME,
      email: TEST_VALID_EMAIL,
      password: TEST_VALID_PASSWORD
    };

    const mockRegisterResponse: RegisterResponse = {
      id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      message: 'Registration successful'
    };

    it('should make POST request to /api/auth/register with user data', () => {
      service.register(registerRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockRegisterResponse);
    });

    it('should return RegisterResponse on successful registration', done => {
      service.register(registerRequest).subscribe({
        next: response => {
          expect(response).toEqual(mockRegisterResponse);
          expect(response.id).toBe('507f1f77bcf86cd799439011');
          expect(response.username).toBe('testuser');
          expect(response.email).toBe('test@example.com');
          expect(response.message).toBe('Registration successful');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(mockRegisterResponse);
    });

    it('should handle registration error with message', done => {
      // When using req.flush() with error status, pass the error body directly
      const errorResponse = {
        message: 'Username already exists: testuser'
      };

      service.register(registerRequest).subscribe({
        next: () => fail('should have failed'),
        error: error => {
          // HttpErrorResponse structure: error.error contains the error body
          expect(error.error.message).toBe('Username already exists: testuser');
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(errorResponse, { status: 409, statusText: 'Conflict' });
    });

    it('should handle network error', done => {
      service.register(registerRequest).subscribe({
        next: () => fail('should have failed'),
        error: error => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle 400 Bad Request error', done => {
      // When using req.flush() with error status, pass the error body directly
      const errorResponse = {
        message: 'Invalid input: username must be between 3 and 20 characters'
      };

      service.register(registerRequest).subscribe({
        next: () => fail('should have failed'),
        error: error => {
          // HttpErrorResponse structure: error.error contains the error body
          expect(error.error.message).toBe(
            'Invalid input: username must be between 3 and 20 characters'
          );
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 409 Conflict error for duplicate user', done => {
      // When using req.flush() with error status, pass the error body directly
      const errorResponse = {
        message: 'Email already exists: test@example.com'
      };

      service.register(registerRequest).subscribe({
        next: () => fail('should have failed'),
        error: error => {
          // HttpErrorResponse structure: error.error contains the error body
          expect(error.error.message).toBe('Email already exists: test@example.com');
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(errorResponse, { status: 409, statusText: 'Conflict' });
    });

    it('should use relative URL for API calls', () => {
      service.register(registerRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.url).toBe('/api/auth/register');
      req.flush(mockRegisterResponse);
    });

    it('should not store token after registration (only after login)', () => {
      service.register(registerRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(mockRegisterResponse);

      // Token should not be set after registration
      expect(service.getToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Token Management', () => {
    it('should store token in localStorage after login', () => {
      const loginRequest: LoginRequest = {
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      };
      const mockAuthResponse: AuthResponse = {
        token: 'mock-jwt-token-123',
        id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
      };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      expect(service.getToken()).toBe('mock-jwt-token-123');
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token-123');
    });

    it('should remove token on logout', () => {
      localStorage.setItem('auth_token', 'mock-token');
      service.logout();

      // Expect and flush the logout HTTP request
      const req = httpMock.expectOne(`${apiUrl}/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Logout successful' });

      expect(service.getToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should return null token when not authenticated', () => {
      localStorage.clear();
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true for isAuthenticated when valid token exists', () => {
      // Create a valid non-expired JWT token for testing
      const validPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000),
        sub: 'test-user'
      };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
      const encodedPayload = btoa(JSON.stringify(validPayload))
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
      const validToken = `${header}.${encodedPayload}.mock-signature`;

      localStorage.setItem('auth_token', validToken);
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('Token Expiration Handling', () => {
    it('should return false for expired tokens in isAuthenticated()', () => {
      // Create expired token (exp is in seconds, past date)
      const expiredPayload = {
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        sub: 'user123'
      };
      const expiredToken = createMockJWT(expiredPayload);
      localStorage.setItem('auth_token', expiredToken);

      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should automatically clear expired tokens', () => {
      // Create expired token
      const expiredPayload = {
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        sub: 'user123'
      };
      const expiredToken = createMockJWT(expiredPayload);
      localStorage.setItem('auth_token', expiredToken);

      service.isAuthenticated();

      // Token should be removed from localStorage
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.getToken()).toBeNull();
    });

    it('should return true for valid non-expired tokens', () => {
      // Create valid token (exp is in seconds, future date)
      const validPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000),
        sub: 'user123'
      };
      const validToken = createMockJWT(validPayload);
      localStorage.setItem('auth_token', validToken);

      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should handle malformed tokens gracefully', () => {
      // Invalid token format
      localStorage.setItem('auth_token', 'invalid.token');

      expect(service.isAuthenticated()).toBeFalse();
      // Token should be cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle tokens with missing payload', () => {
      // Token without payload part
      localStorage.setItem('auth_token', 'header.');

      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle tokens without expiration claim', () => {
      // Token without exp claim
      const payloadWithoutExp = {
        iat: Math.floor(Date.now() / 1000),
        sub: 'user123'
      };
      const tokenWithoutExp = createMockJWT(payloadWithoutExp);
      localStorage.setItem('auth_token', tokenWithoutExp);

      // Should treat as expired (no exp claim)
      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should decode JWT payload correctly', () => {
      // Create valid token with specific claims
      const payload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        sub: 'user123',
        username: 'testuser'
      };
      const validToken = createMockJWT(payload);
      localStorage.setItem('auth_token', validToken);

      // Token should be valid and not cleared
      expect(service.isAuthenticated()).toBeTrue();
      expect(localStorage.getItem('auth_token')).toBe(validToken);
    });

    it('should handle tokens expiring exactly now', () => {
      // Token expiring exactly at current time
      const expiringNowPayload = {
        exp: Math.floor(Date.now() / 1000), // Exactly now
        sub: 'user123'
      };
      const expiringNowToken = createMockJWT(expiringNowPayload);
      localStorage.setItem('auth_token', expiringNowToken);

      // Should be treated as expired (>= check)
      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle empty token string', () => {
      localStorage.setItem('auth_token', '');

      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should handle token with only one dot', () => {
      localStorage.setItem('auth_token', 'invalid.token');

      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('Registration Request Interface', () => {
    it('should accept RegisterRequest with username, email, and password', () => {
      const request: RegisterRequest = {
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      };

      service.register(request).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.body.username).toBe(TEST_VALID_USERNAME);
      expect(req.request.body.email).toBe(TEST_VALID_EMAIL);
      expect(req.request.body.password).toBe(TEST_VALID_PASSWORD);
      req.flush({} as RegisterResponse);
    });
  });

  describe('login()', () => {
    it('should not store token when response has no token', () => {
      const loginRequest: LoginRequest = {
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      };
      const mockAuthResponse: AuthResponse = {
        token: '', // Empty token
        id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
      };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      // Token should not be stored if empty
      expect(service.getToken()).toBeNull();
    });

    it('should handle login response without token property', () => {
      const loginRequest: LoginRequest = {
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      };
      const mockAuthResponse = {
        id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
        // No token property
      } as AuthResponse;

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      // Token should not be stored
      expect(service.getToken()).toBeNull();
    });
  });

  describe('logout()', () => {
    it('should continue logout even if backend call fails', () => {
      localStorage.setItem('auth_token', 'mock-token');
      service.logout();

      const req = httpMock.expectOne(`${apiUrl}/logout`);
      req.error(new ProgressEvent('Network error'));

      // Should still clear token and navigate
      expect(service.getToken()).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('getUserIdFromToken()', () => {
    it('should return null when no token provided and no stored token', () => {
      localStorage.clear();
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('should extract userId from provided token', () => {
      const payload = {
        userId: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const token = createMockJWT(payload);
      expect(service.getUserIdFromToken(token)).toBe('user123');
    });

    it('should extract id when userId is not present', () => {
      const payload = {
        id: 'user456',
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const token = createMockJWT(payload);
      expect(service.getUserIdFromToken(token)).toBe('user456');
    });

    it('should return null when neither userId nor id is present', () => {
      const payload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser'
      };
      const token = createMockJWT(payload);
      expect(service.getUserIdFromToken(token)).toBeNull();
    });

    it('should return null for token with missing payload', () => {
      expect(service.getUserIdFromToken('header.')).toBeNull();
    });

    it('should return null for malformed token', () => {
      expect(service.getUserIdFromToken('invalid-token')).toBeNull();
    });

    it('should use stored token when no token provided', () => {
      const payload = {
        userId: 'stored-user',
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const token = createMockJWT(payload);
      localStorage.setItem('auth_token', token);

      expect(service.getUserIdFromToken()).toBe('stored-user');
    });
  });

  describe('getCurrentUser()', () => {
    it('should return null when no user is set', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current user after login', () => {
      const loginRequest: LoginRequest = {
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      };
      const mockAuthResponse: AuthResponse = {
        token: 'mock-jwt-token-123',
        id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
      };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      expect(service.getCurrentUser()).toEqual(mockAuthResponse);
    });
  });
});
