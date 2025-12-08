import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Note: Using hardcoded username until user profile integration is complete
  // Future enhancement: Load username from AuthService or ProfileService
  username = 'Warrior';

  constructor(private readonly authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
