import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { GameArenaComponent } from '../../arena/components/game-arena/game-arena.component';
import { GameState } from '../../types/game.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, GameArenaComponent],
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
  gameState$: Observable<GameState | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly gameService: GameService
  ) {
    this.gameState$ = this.gameService.getGameState();
  }

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

    // Note: Currently using userIds as display names
    // Future enhancement: Fetch actual usernames from profile service
    if (this.matchId) {
      this.currentUserName = this.currentUserId || 'You';
      this.opponentName = this.opponentId || 'Opponent';

      // Connect to the game engine for this match
      this.gameService.connectToGame(this.matchId).subscribe({
        next: () => {},
        error: err => {
          // eslint-disable-next-line no-console
          console.error('Failed to connect to game service', err);
        }
      });
    }
  }
}
