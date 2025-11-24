import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Username will be loaded from AuthService when user profile is implemented
  username = 'Warrior';

  stats = {
    wins: 42,
    losses: 28,
    winRate: 60,
    rank: 1250,
    level: 15
  };
}
