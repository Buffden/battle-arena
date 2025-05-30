import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, service: keyof typeof environment.apiUrls): Observable<T> {
    const baseUrl = environment.apiUrls[service];
    return this.http.get<T>(`${baseUrl}${endpoint}`, this.httpOptions);
  }

  post<T>(endpoint: string, data: any, service: keyof typeof environment.apiUrls): Observable<T> {
    const baseUrl = environment.apiUrls[service];
    return this.http.post<T>(`${baseUrl}${endpoint}`, data, this.httpOptions);
  }

  put<T>(endpoint: string, data: any, service: keyof typeof environment.apiUrls): Observable<T> {
    const baseUrl = environment.apiUrls[service];
    return this.http.put<T>(`${baseUrl}${endpoint}`, data, this.httpOptions);
  }

  delete<T>(endpoint: string, service: keyof typeof environment.apiUrls): Observable<T> {
    const baseUrl = environment.apiUrls[service];
    return this.http.delete<T>(`${baseUrl}${endpoint}`, this.httpOptions);
  }
} 