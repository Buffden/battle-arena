import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService, Profile } from '../../services/auth.service';
import { STAT_CARDS, DASHBOARD_BUTTONS, TABLE_COLUMNS, StatCardConfig, DashboardButtonConfig, TableColumnConfig } from './dashboard.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  error: string | null = null;
  isLoggedIn = false;

  statCards: StatCardConfig[] = STAT_CARDS;
  dashboardButtons: DashboardButtonConfig[] = DASHBOARD_BUTTONS;
  tableColumns: TableColumnConfig[] = TABLE_COLUMNS;

  selectedMode = 0; // 0: 1 Player, 1: 2 Players

  // Example matches data (replace with API call if needed)
  matches = [
    { match: '#35212', opponent: 'AIDEN', result: 'WIN', xp: '+40 25', new: 'NEW SKIN' },
    { match: '#03511', opponent: 'NDYA', result: 'LOSS', xp: '+10 25', new: 'FIRECANNON!!' },
  ];

  showRecentMatches = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.error = null;
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
        this.isLoggedIn = true;
      },
      error: (err) => {
        console.error('Failed to fetch profile:', err);
        this.error = 'Failed to load profile. Please try again later.';
        this.loading = false;
        this.isLoggedIn = false;
        this.authService.logout();
      }
    });
  }

  getStatValue(key: string): string | number {
    if (this.error || !this.profile) return 'N/A';
    // fallback to N/A if value is missing
    return (this.profile as any)[key] ?? 'N/A';
  }

  getRowValue(row: any, key: string): string {
    return row && key in row ? row[key] : 'N/A';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
      this.selectedMode = (this.selectedMode + 1) % 2;
      event.preventDefault();
    } else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      this.selectedMode = (this.selectedMode + 1) % 2;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.onPlay();
      event.preventDefault();
    }
  }

  onPlay() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.selectedMode === 0) {
      // Solo queue
      this.router.navigate(['/matchmaking']);
    } else {
      // TODO: Implement 2-player mode
      console.log('2 Player mode not implemented yet');
    }
  }

  onRecentMatchesClick() {
    this.showRecentMatches = !this.showRecentMatches;
  }

  onButtonClick(action: string) {
    switch (action) {
      case 'login':
        if (this.isLoggedIn) {
          this.authService.logout();
          this.isLoggedIn = false;
          this.profile = null;
        } else {
          this.router.navigate(['/login']);
        }
        break;
      // Add other button actions here
    }
  }
}
