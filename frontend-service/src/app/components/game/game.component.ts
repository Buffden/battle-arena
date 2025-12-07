import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  matchId: string | null = null;
  gameRoomId: string | null = null;
  currentUserId: string | null = null;
  opponentId: string | null = null;
  currentUserName: string = 'You';
  opponentName: string = 'Opponent';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get matchId from route
    this.matchId = this.route.snapshot.paramMap.get('matchId');

    // Get current user ID
    this.currentUserId = this.authService.getUserIdFromToken();

    // Get opponent info from route state (passed from matchmaking component)
    // Use history.state as fallback for browser navigation
    const state = globalThis.window?.history?.state || {};

    if (state?.opponentId) {
      this.opponentId = state.opponentId;
      this.gameRoomId = state.gameRoomId;
    }

    // For now, we'll use userIds as names
    // TODO: Fetch actual usernames from profile service
    if (this.matchId) {
      this.currentUserName = this.currentUserId || 'You';
      this.opponentName = this.opponentId || 'Opponent';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
