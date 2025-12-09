import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class GameHudComponent implements OnInit, OnDestroy, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    // Update hero data when gameState input changes
    if (changes['gameState'] && this.gameState) {
      this.updateHeroData();
    }
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
      this.playerHero = null;
      this.opponentHero = null;
      this.isPlayerTurn = false;
      this.turnTimeRemaining = 0;
      return;
    }

    // Validate that both players exist in game state
    if (!this.gameState.player1 || !this.gameState.player2) {
      console.warn('GameHudComponent: Invalid game state - missing player data');
      this.playerHero = null;
      this.opponentHero = null;
      this.isPlayerTurn = false;
      this.turnTimeRemaining = 0;
      return;
    }

    // Determine which hero is the player and which is the opponent
    // Check if current user is player1 or player2
    if (this.gameState.player1.userId === this.currentUserId) {
      this.playerHero = this.gameState.player1;
      this.opponentHero = this.gameState.player2;
    } else if (this.gameState.player2.userId === this.currentUserId) {
      this.playerHero = this.gameState.player2;
      this.opponentHero = this.gameState.player1;
    } else {
      // Current user is not in this game (shouldn't happen, but handle gracefully)
      console.warn('GameHudComponent: Current user not found in game state');
      this.playerHero = null;
      this.opponentHero = null;
      this.isPlayerTurn = false;
      this.turnTimeRemaining = 0;
      return;
    }

    // Check if it's player's turn
    this.isPlayerTurn = this.gameState.currentTurn === this.currentUserId;

    // Always use server's turnTimeRemaining as source of truth
    // This ensures timer stays in sync with server updates
    this.turnTimeRemaining = this.gameState.turnTimeRemaining || 0;

    // Debug logging
    console.log('=== GameHudComponent: Updated hero data ===');
    console.log('Current user ID:', this.currentUserId);
    console.log('Player hero:', this.playerHero);
    console.log('Opponent hero:', this.opponentHero);
    console.log('Is player turn:', this.isPlayerTurn);
    console.log('Turn time remaining:', this.turnTimeRemaining);
    console.log('Player health:', this.playerHero?.health, '/', this.playerHero?.maxHealth);
    console.log('Opponent health:', this.opponentHero?.health, '/', this.opponentHero?.maxHealth);
  }

  /**
   * Update turn timer
   * Note: Server is the source of truth for timer values.
   * This method only provides a visual countdown between server updates.
   * When gameState updates, turnTimeRemaining is refreshed from server.
   */
  private updateTurnTimer(): void {
    if (!this.gameState) {
      this.turnTimeRemaining = 0;
      return;
    }

    // Only decrement if we have a valid timer value
    // Server updates will refresh this value via updateHeroData()
    if (this.turnTimeRemaining > 0) {
      this.turnTimeRemaining = Math.max(0, this.turnTimeRemaining - 1);
    } else {
      // Ensure timer doesn't go negative
      this.turnTimeRemaining = 0;
    }
  }

  /**
   * Get health percentage for player
   */
  getPlayerHealthPercent(): number {
    if (!this.playerHero?.maxHealth || this.playerHero.maxHealth <= 0) {
      return 0;
    }
    const percent = (this.playerHero.health / this.playerHero.maxHealth) * 100;
    return Math.max(0, Math.min(100, percent)); // Clamp between 0 and 100
  }

  /**
   * Get health percentage for opponent
   */
  getOpponentHealthPercent(): number {
    if (!this.opponentHero?.maxHealth || this.opponentHero.maxHealth <= 0) {
      return 0;
    }
    const percent = (this.opponentHero.health / this.opponentHero.maxHealth) * 100;
    return Math.max(0, Math.min(100, percent)); // Clamp between 0 and 100
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
