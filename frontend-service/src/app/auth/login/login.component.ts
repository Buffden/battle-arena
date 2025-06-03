import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Login form fields
  username = '';
  password = '';
  loginError = '';

  // Register form fields
  registerUsername = '';
  registerEmail = '';
  registerPassword = '';
  registerError = '';
  registerSuccess = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.loginError = err.error?.error || 'Login failed'
    });
  }

  onRegister() {
    this.auth.register({ 
      username: this.registerUsername, 
      email: this.registerEmail, 
      password: this.registerPassword 
    }).subscribe({
      next: () => {
        this.registerSuccess = 'Registered successfully! You can now login.';
        this.registerError = '';
        // Clear register form
        this.registerUsername = '';
        this.registerEmail = '';
        this.registerPassword = '';
      },
      error: err => {
        this.registerError = err.error?.error || 'Registration failed';
        this.registerSuccess = '';
      }
    });
  }
}
