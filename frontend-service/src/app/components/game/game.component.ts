import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { GameArenaComponent } from '../../arena/components/game-arena/game-arena.component';
import { GameHudComponent } from '../../arena/components/game-hud/game-hud.component';
import { GameState } from '../../types/game.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, GameArenaComponent, GameHudComponent],
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
    }
  }

  goBack(): void {
    this.gameService.disconnect();
    this.router.navigate(['/dashboard']);
  }
}
