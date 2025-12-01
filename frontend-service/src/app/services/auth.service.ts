import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  LogoutResponse
} from '../types/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Relative URL ensures requests go through nginx gateway (same origin)
  private readonly apiUrl = '/api/auth';
  private readonly currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const token = this.getToken();
    if (token) {
      // Token validation and user loading will be implemented when profile service is integrated
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.currentUserSubject.next(response);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    // Optional backend call for API consistency (JWT is stateless, so logout is primarily client-side)
    this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {},
      error: () => {
        // Continue with logout even if backend call fails (JWT is stateless)
      }
    });

    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    if (globalThis.window !== undefined) {
      return globalThis.window.localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.removeToken();
      this.currentUserSubject.next(null);
      return false;
    }

    return true;
  }

  /**
   * Checks if JWT token is expired.
   *
   * <p>
   * Decodes JWT token and checks expiration claim (exp).
   * </p>
   *
   * @param token JWT token string
   * @return true if token is expired, false otherwise
   */
  private isTokenExpired(token: string): boolean {
    try {
      // Decode JWT token (base64url encoded payload)
      const payload = token.split('.')[1];
      if (!payload) {
        return true;
      }

      // Decode base64url to JSON
      const decodedPayload = JSON.parse(
        globalThis.window.atob(payload.replaceAll('-', '+').replaceAll('_', '/'))
      );

      // Check expiration claim (exp is Unix timestamp in seconds)
      const exp = decodedPayload.exp;
      if (!exp) {
        return true; // No expiration claim, consider expired
      }

      // Compare expiration time with current time (in seconds)
      return Date.now() >= exp * 1000;
    } catch {
      // Invalid token format, consider expired
      return true;
    }
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
}
