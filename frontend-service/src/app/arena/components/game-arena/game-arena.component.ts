import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as Phaser from 'phaser';
import { GameService } from '../../../services/game.service';
import { GameState } from '../../../types/game.types';
import { gameConfig } from '../../../config/game.config';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-game-arena',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-arena.component.html',
  styleUrl: './game-arena.component.css'
})
export class GameArenaComponent implements OnInit, OnDestroy {
  @Input() matchId: string | null = null;

  gameState: GameState | null = null;
  gameScene: Phaser.Scene | null = null;
  phaserGame: Phaser.Game | null = null;

  private gameStateSubscription?: Subscription;
  private gameErrorSubscription?: Subscription;
  private currentUserId: string | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.matchId) {
      console.error('GameArenaComponent: matchId is required');
      return;
    }

    this.currentUserId = this.authService.getUserIdFromToken();

    // Handle window resize for fullscreen
    if (globalThis.window) {
      this.onWindowResize = this.onWindowResize.bind(this);
      globalThis.window.addEventListener('resize', this.onWindowResize);
    }

    // Connect to game
    this.gameService.connectToGame(this.matchId).subscribe({
      next: () => {
        console.log('Connected to game engine');
        this.initializePhaser();
      },
      error: error => {
        console.error('Failed to connect to game engine:', error);
      }
    });

    // Subscribe to game state updates
    this.gameStateSubscription = this.gameService.getGameState().subscribe(state => {
      if (state) {
        this.gameState = state;
        this.updateGameScene(state);
      }
    });

    // Subscribe to game errors
    this.gameErrorSubscription = this.gameService.getGameErrors().subscribe(error => {
      console.error('Game error:', error);
    });
  }

  private onWindowResize(): void {
    if (this.phaserGame) {
      const viewportWidth = globalThis.window?.innerWidth || 800;
      const viewportHeight = globalThis.window?.innerHeight || 600;
      this.phaserGame.scale.resize(viewportWidth, viewportHeight);
    }
  }

  ngOnDestroy(): void {
    // Remove window resize listener
    if (globalThis.window) {
      globalThis.window.removeEventListener('resize', this.onWindowResize);
    }

    // Clean up subscriptions
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.gameErrorSubscription) {
      this.gameErrorSubscription.unsubscribe();
    }

    // Clean up Phaser game
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
      this.gameScene = null;
    }

    // Disconnect from game
    this.gameService.disconnect();
  }

  /**
   * Initialize Phaser game instance
   */
  private initializePhaser(): void {
    if (this.phaserGame) {
      return; // Already initialized
    }

    // Create a custom scene class
    class GameArenaScene extends Phaser.Scene {
      private readonly component: GameArenaComponent;

      constructor(component: GameArenaComponent) {
        super({ key: 'GameArenaScene' });
        this.component = component;
      }

      create(): void {
        this.component.gameScene = this;

        // Get viewport dimensions for fullscreen
        const viewportWidth = this.scale.width;
        const viewportHeight = this.scale.height;

        // Draw fullscreen arena background
        this.add.rectangle(
          viewportWidth / 2,
          viewportHeight / 2,
          viewportWidth,
          viewportHeight,
          gameConfig.arena.backgroundColor
        );

        // Draw terrain/ground at bottom
        const groundHeight = 50;
        this.add.rectangle(
          viewportWidth / 2,
          viewportHeight - groundHeight / 2,
          viewportWidth,
          groundHeight,
          0x8b4513 // Brown ground
        );

        // Initial hero sprites will be created when game state is received
        if (this.component.gameState) {
          this.component.updateGameScene(this.component.gameState);
        }
      }

      override update(): void {
        // Update logic can be added here if needed
      }
    }

    // Get viewport dimensions for fullscreen
    const viewportWidth = globalThis.window?.innerWidth || gameConfig.arena.defaultWidth;
    const viewportHeight = globalThis.window?.innerHeight || gameConfig.arena.defaultHeight;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: viewportWidth,
      height: viewportHeight,
      parent: 'game-arena-container',
      backgroundColor: gameConfig.arena.backgroundColor,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scene: new GameArenaScene(this),
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.phaserGame = new Phaser.Game(config);
  }

  /**
   * Update Phaser scene (called every frame)
   */
  private updateScene(): void {
    // Update logic can be added here if needed
  }

  /**
   * Update game scene with new game state
   */
  private updateGameScene(state: GameState): void {
    if (!this.gameScene) {
      return;
    }

    // Clear existing hero sprites (if any)
    const existingHeroes = this.gameScene.children.list.filter(
      child => (child as any).data?.get('isHero') === true
    );
    existingHeroes.forEach(hero => hero.destroy());

    // Determine which hero is the player and which is the opponent
    const playerHero = state.player1.userId === this.currentUserId ? state.player1 : state.player2;
    const opponentHero =
      state.player1.userId === this.currentUserId ? state.player2 : state.player1;

    // Create player hero sprite
    this.createHeroSprite(playerHero, true);

    // Create opponent hero sprite
    this.createHeroSprite(opponentHero, false);
  }

  /**
   * Create hero sprite in Phaser scene
   */
  private createHeroSprite(hero: GameState['player1'], isPlayer: boolean): void {
    if (!this.gameScene) {
      return;
    }

    // Create a simple rectangle sprite for now (can be replaced with actual sprite images later)
    const sprite = this.gameScene.add.rectangle(
      hero.position.x,
      hero.position.y,
      gameConfig.hero.defaultWidth,
      gameConfig.hero.defaultHeight,
      isPlayer ? 0x00ff00 : 0xff0000 // Green for player, red for opponent
    );

    // Store hero data in sprite
    sprite.setData('isHero', true);
    sprite.setData('heroId', hero.id);
    sprite.setData('userId', hero.userId);

    // Add health bar above hero
    this.createHealthBar(sprite, hero);
  }

  /**
   * Create health bar above hero
   */
  private createHealthBar(sprite: Phaser.GameObjects.Rectangle, hero: GameState['player1']): void {
    if (!this.gameScene) {
      return;
    }

    const barWidth = 40;
    const barHeight = 4;
    const barX = sprite.x;
    const barY = sprite.y - gameConfig.hero.defaultHeight / 2 - 10;

    // Background (red/damaged portion)
    const bgBar = this.gameScene.add.rectangle(barX, barY, barWidth, barHeight, 0xff0000);
    bgBar.setDepth(10);

    // Health (green portion)
    const healthPercent = hero.health / hero.maxHealth;
    const healthWidth = barWidth * healthPercent;
    const healthBar = this.gameScene.add.rectangle(
      barX - (barWidth - healthWidth) / 2,
      barY,
      healthWidth,
      barHeight,
      0x00ff00
    );
    healthBar.setDepth(11);

    // Store health bar references in sprite data for updates
    sprite.setData('healthBar', healthBar);
    sprite.setData('healthBarBg', bgBar);
  }
}
