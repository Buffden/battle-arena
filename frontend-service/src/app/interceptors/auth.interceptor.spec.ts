import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('JWT Token Injection', () => {
    it('should add Authorization header when token exists', () => {
      const token = 'mock-jwt-token-123';
      spyOn(authService, 'getToken').and.returnValue(token);

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('should not add Authorization header when token does not exist', () => {
      spyOn(authService, 'getToken').and.returnValue(null);

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('401 Error Handling', () => {
    it('should logout and redirect to login on 401 error', () => {
      spyOn(authService, 'getToken').and.returnValue('mock-token');
      spyOn(authService, 'logout');

      httpClient.get('/api/test').subscribe({
        next: () => {},
        error: () => {}
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should re-throw error after handling 401', done => {
      spyOn(authService, 'getToken').and.returnValue('mock-token');
      spyOn(authService, 'logout');

      httpClient.get('/api/test').subscribe({
        next: () => {
          done.fail('Should have thrown error');
        },
        error: error => {
          expect(error.status).toBe(401);
          expect(authService.logout).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });

    it('should not logout on non-401 errors', () => {
      spyOn(authService, 'getToken').and.returnValue('mock-token');
      spyOn(authService, 'logout');

      httpClient.get('/api/test').subscribe({
        next: () => {},
        error: () => {}
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      expect(authService.logout).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
