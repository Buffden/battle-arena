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
  waitingForOpponent = false;

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

    // Subscribe to game-joined event (for "Waiting for opponent..." message)
    // Use BehaviorSubject so we get the last value even if subscription happens after event
    this.gameService.gameJoined$.subscribe(data => {
      if (data?.message === 'Waiting for opponent...') {
        console.log(
          '=== GameArenaComponent: Received game-joined, setting waitingForOpponent = true ==='
        );
        this.waitingForOpponent = true;
      }
    });

    // Subscribe to game state updates
    this.gameStateSubscription = this.gameService.getGameState().subscribe(state => {
      console.log('=== GameArenaComponent: Received game state update ===');
      console.log('Game state:', state);
      if (state) {
        this.gameState = state;
        this.waitingForOpponent = false; // Game started, no longer waiting
        console.log('=== GameArenaComponent: Updating game scene ===');
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
      private arenaBackground: Phaser.GameObjects.Image | null = null;

      constructor(component: GameArenaComponent) {
        super({ key: 'GameArenaScene' });
        this.component = component;
      }

      preload(): void {
        // Clear any existing texture to prevent caching issues
        if (this.textures.exists('arena-background')) {
          this.textures.remove('arena-background');
        }
        
        // Load arena background image with cache busting
        // Add timestamp to prevent browser caching issues across different displays
        const timestamp = Date.now();
        this.load.image('arena-background', `assets/arenas/arena-02.png?v=${timestamp}`);
      }

      create(): void {
        this.component.gameScene = this;

        // Load and display arena background image
        // Always ensure fresh load by checking if texture exists
        if (!this.textures.exists('arena-background')) {
          // If texture doesn't exist, reload it
          const timestamp = Date.now();
          this.textures.remove('arena-background'); // Clear any stale texture
          this.load.image('arena-background', `assets/arenas/arena-02.png?v=${timestamp}`);
          this.load.once('filecomplete-image-arena-background', () => {
            this.createArenaBackground();
          });
          this.load.start();
          return;
        }
        
        this.createArenaBackground();
      }

      private createArenaBackground(): void {
        if (!this.textures.exists('arena-background')) {
          return;
        }

        const texture = this.textures.get('arena-background');
        const imageWidth = texture.source[0].width;
        const imageHeight = texture.source[0].height;
        const viewportWidth = this.scale.width;
        const viewportHeight = this.scale.height;

          // Stretch image to fill entire viewport (no aspect ratio preservation)
          const scaleX = viewportWidth / imageWidth;
          const scaleY = viewportHeight / imageHeight;
          
          // Position image at origin (0, 0)
          this.arenaBackground = this.add.image(0, 0, 'arena-background');
          this.arenaBackground.setOrigin(0, 0); // Set origin to top-left
          this.arenaBackground.setDepth(-1000);
          // Set different scales for X and Y to stretch to viewport size
          this.arenaBackground.setScale(scaleX, scaleY);

          // Image now fills entire viewport, no centering needed
          this.arenaBackground.x = 0;
          this.arenaBackground.y = 0;

        // Set camera bounds to match viewport
        this.cameras.main.setBounds(0, 0, viewportWidth, viewportHeight);
        this.cameras.main.centerOn(viewportWidth / 2, viewportHeight / 2);

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
  private updateGameScene(_state: GameState): void {
    if (!this.gameScene) {
      return;
    }

    // Hero sprites removed - no longer displaying player/opponent sprites
  }
}
