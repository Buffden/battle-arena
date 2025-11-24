import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import {
  AuthService,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  AuthResponse
} from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/auth';

  // Test data constants (clearly marked as test-only, not real credentials)
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

      expect(service.getToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should return null token when not authenticated', () => {
      localStorage.clear();
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true for isAuthenticated when token exists', () => {
      localStorage.setItem('auth_token', 'mock-token');
      expect(service.isAuthenticated()).toBeTrue();
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
});
