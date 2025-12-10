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
  matchStartTime: number = 0;
  matchDuration: number = 300; // 5 minutes in seconds
  private timerInterval?: ReturnType<typeof setInterval>;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    this.updateHeroData();
    
    // Initialize match timer
    if (this.gameState) {
      this.matchStartTime = this.gameState.createdAt || Date.now();
    }
    
    // Start timer update interval
    this.timerInterval = setInterval(() => {
      // Force change detection for timer display
      if (this.gameState) {
        // Timer will update via formatMatchTimer() method
      }
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update hero data when gameState input changes
    if (changes['gameState'] && this.gameState) {
      this.updateHeroData();
      
      // Update match start time if game just started
      if (this.gameState.gameStatus === 'active' && !this.matchStartTime) {
        this.matchStartTime = this.gameState.createdAt || Date.now();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  /**
   * Update hero data when game state changes
   */
  private updateHeroData(): void {
    if (!this.gameState || !this.currentUserId) {
      this.playerHero = null;
      this.opponentHero = null;
      return;
    }

    // Validate that both players exist in game state
    if (!this.gameState.player1 || !this.gameState.player2) {
      console.warn('GameHudComponent: Invalid game state - missing player data');
      this.playerHero = null;
      this.opponentHero = null;
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
      return;
    }

    // Debug logging
    console.log('=== GameHudComponent: Updated hero data ===');
    console.log('Current user ID:', this.currentUserId);
    console.log('Player hero:', this.playerHero);
    console.log('Opponent hero:', this.opponentHero);
    console.log('Player health:', this.playerHero?.health, '/', this.playerHero?.maxHealth);
    console.log('Opponent health:', this.opponentHero?.health, '/', this.opponentHero?.maxHealth);
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
   * Get player name (fallback to "Player 1" if not available)
   */
  getPlayerName(): string {
    // TODO: Get actual player name from profile service when available
    return this.playerHero?.userId?.substring(0, 8) || 'Player 1';
  }

  /**
   * Get opponent name (fallback to "Player 2" if not available)
   */
  getOpponentName(): string {
    // TODO: Get actual opponent name from profile service when available
    return this.opponentHero?.userId?.substring(0, 8) || 'Player 2';
  }

  /**
   * Format match timer as MM:SS
   */
  formatMatchTimer(): string {
    if (!this.matchStartTime) {
      return '05:00';
    }

    const elapsed = Math.floor((Date.now() - this.matchStartTime) / 1000);
    const remaining = Math.max(0, this.matchDuration - elapsed);
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
