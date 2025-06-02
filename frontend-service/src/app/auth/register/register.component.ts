import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Registered successfully! Redirecting to login...';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.error || 'Registration failed';
        this.success = '';
      }
    });
  }
}
