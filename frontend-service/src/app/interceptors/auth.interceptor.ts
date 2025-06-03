import { HttpInterceptorFn } from '@angular/common/http';

const publicEndpoints = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/test'
];

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for public endpoints
  if (publicEndpoints.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
}; 