import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../types/game.types';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-game-hud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-hud.component.html',
  styleUrl: './game-hud.component.css'
})
export class GameHudComponent implements OnInit, OnDestroy {
  @Input() gameState: GameState | null = null;

  currentUserId: string | null = null;
  playerHero: GameState['player1'] | null = null;
  opponentHero: GameState['player1'] | null = null;
  isPlayerTurn: boolean = false;
  turnTimeRemaining: number = 0;

  private updateInterval?: ReturnType<typeof setInterval>;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    this.updateHeroData();

    // Update turn timer every second
    this.updateInterval = setInterval(() => {
      this.updateTurnTimer();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  /**
   * Update hero data when game state changes
   */
  private updateHeroData(): void {
    if (!this.gameState || !this.currentUserId) {
      return;
    }

    // Determine which hero is the player and which is the opponent
    this.playerHero =
      this.gameState.player1.userId === this.currentUserId
        ? this.gameState.player1
        : this.gameState.player2;
    this.opponentHero =
      this.gameState.player1.userId === this.currentUserId
        ? this.gameState.player2
        : this.gameState.player1;

    // Check if it's player's turn
    this.isPlayerTurn = this.gameState.currentTurn === this.currentUserId;
    this.turnTimeRemaining = this.gameState.turnTimeRemaining;
  }

  /**
   * Update turn timer
   */
  private updateTurnTimer(): void {
    if (!this.gameState) {
      return;
    }

    // Decrement timer (server will send updates, but we can show countdown)
    if (this.turnTimeRemaining > 0) {
      this.turnTimeRemaining = Math.max(0, this.turnTimeRemaining - 1);
    }
  }

  /**
   * Get health percentage for player
   */
  getPlayerHealthPercent(): number {
    if (!this.playerHero) {
      return 0;
    }
    return (this.playerHero.health / this.playerHero.maxHealth) * 100;
  }

  /**
   * Get health percentage for opponent
   */
  getOpponentHealthPercent(): number {
    if (!this.opponentHero) {
      return 0;
    }
    return (this.opponentHero.health / this.opponentHero.maxHealth) * 100;
  }

  /**
   * Format time remaining as MM:SS
   */
  formatTimeRemaining(): string {
    const minutes = Math.floor(this.turnTimeRemaining / 60);
    const seconds = this.turnTimeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
