import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor for JWT authentication.
 *
 * <p>
 * Automatically adds Authorization header with JWT token to all HTTP requests.
 * Handles 401 Unauthorized responses by logging out the user and redirecting to login.
 * </p>
 *
 * <p>
 * Design Pattern: Interceptor Pattern - Cross-cutting concern for authentication
 * </p>
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Clone request and add Authorization header if token exists
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle response and errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/']);
        }

        // Re-throw error for component handling (including 404s and other errors)
        return throwError(() => error);
      })
    );
  }
}
