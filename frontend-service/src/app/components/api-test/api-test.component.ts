import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-test.component.html',
  styleUrl: './api-test.component.css'
})
export class ApiTestComponent {
  response: any;
  error: any;

  constructor(private apiService: ApiService) {}

  testAuthService() {
    this.apiService.get('/test', 'auth').subscribe({
      next: (data) => {
        this.response = data;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.response = null;
      }
    });
  }

  testProfileService() {
    this.apiService.get('/test', 'profile').subscribe({
      next: (data) => {
        this.response = data;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.response = null;
      }
    });
  }
}
