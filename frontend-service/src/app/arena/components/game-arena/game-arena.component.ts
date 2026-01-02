import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as Phaser from 'phaser';
import { GameService } from '../../../services/game.service';
import { GameState } from '../../../types/game.types';
import { gameConfig } from '../../../config/game.config';
import { AuthService } from '../../../services/auth.service';
import { WalkableZone } from '../../../types/game.types';
@Component({
  selector: 'app-game-arena',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-arena.component.html',
  styleUrl: './game-arena.component.css'
})
export class GameArenaComponent implements OnInit, OnDestroy {
  @Input() matchId: string | null = null;
  activeZoneId = 'main-ground';
  walkableZones = new Map<string, WalkableZone>();

  walkableGeom!: Phaser.Geom.Polygon;
  testTank: Phaser.GameObjects.Rectangle | null = null;

  arenaBounds = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  };

  gameState: GameState | null = null;
  gameScene: Phaser.Scene | null = null;
  phaserGame: Phaser.Game | null = null;
  waitingForOpponent = false;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;

  private gameStateSubscription?: Subscription;
  private gameErrorSubscription?: Subscription;
  private currentUserId: string | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.matchId) {
      return;
    }

    this.currentUserId = this.authService.getUserIdFromToken();

    // Handle window resize for fullscreen
    if (globalThis.window) {
      this.onWindowResize = this.onWindowResize.bind(this);
      globalThis.window.addEventListener('resize', this.onWindowResize);
    }

    // Commenting for now
    // Connect to game
    // this.gameService.connectToGame(this.matchId).subscribe({
    //   next: () => {
    //     console.log('Connected to game engine');
    //     this.initializePhaser();
    //   },
    //   error: error => {
    //     console.error('Failed to connect to game engine:', error);
    //   }
    // });
    // TEMP: initialize Phaser locally for movement/terrain work
    this.initializePhaser();

    // Subscribe to game-joined event (for "Waiting for opponent..." message)
    // Use BehaviorSubject so we get the last value even if subscription happens after event
    this.gameService.gameJoined$.subscribe(data => {
      if (data && data.message === 'Waiting for opponent...') {
        this.waitingForOpponent = true;
      }
    });

    // Subscribe to game state updates
    this.gameStateSubscription = this.gameService.getGameState().subscribe(state => {
      if (state) {
        this.gameState = state;
        this.waitingForOpponent = false; // Game started, no longer waiting
        this.updateGameScene(state);
      }
    });

    // Subscribe to game errors
    this.gameErrorSubscription = this.gameService.getGameErrors().subscribe(_error => {});
  }

  private onWindowResize(): void {
    if (this.phaserGame) {
      const viewportWidth = globalThis.window?.innerWidth || 800;
      const viewportHeight = globalThis.window?.innerHeight || 600;
      this.phaserGame.scale.resize(viewportWidth, viewportHeight);
    }
  }
  drawWalkablePolygon(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.fillStyle(0x00ff00, 0.15);

    const poly = this.walkableGeom.points;

    graphics.beginPath();
    graphics.moveTo(poly[0].x, poly[0].y);

    for (let i = 1; i < poly.length; i++) {
      graphics.lineTo(poly[i].x, poly[i].y);
    }

    graphics.closePath();
    graphics.strokePath();
    graphics.fillPath();

    graphics.setDepth(9999);
  }

  ngOnDestroy(): void {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
      this.gameScene = null;
    }

    // Disconnect from game
    this.gameService.disconnect();
  }

  private initializePhaser(): void {
    if (this.phaserGame) {
      return; // Already initialized
    }

    const width = globalThis.window?.innerWidth || gameConfig.arena.defaultWidth;
    const height = globalThis.window?.innerHeight || gameConfig.arena.defaultHeight;

    this.arenaBounds = {
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height
    };

    class GameArenaScene extends Phaser.Scene {
      private readonly component: GameArenaComponent;

      constructor(component: GameArenaComponent) {
        super({ key: 'GameArenaScene' });
        this.component = component;
      }

      preload(): void {
        this.load.json('arena-hills-v1', 'assets/arenas/arena-hills-v1.json');
      }

      create(): void {
        this.component.gameScene = this;

        const arenaData = this.cache.json.get('arena-hills-v1') as {
          walkableZones: {
            id: string;
            polygon: { x: number; y: number }[];
          }[];
        };

        // Register walkable zones
        for (const zone of arenaData.walkableZones) {
          const flatPoints = zone.polygon.flatMap(p => [p.x, p.y]);

          const poly = new Phaser.Geom.Polygon(flatPoints);

          this.component.walkableZones.set(zone.id, {
            id: zone.id,
            polygon: poly
          });

          // DEBUG DRAW
          const graphics = this.add.graphics();
          graphics.lineStyle(2, 0x00ff00, 1);
          graphics.fillStyle(0x00ff00, 0.15);
          graphics.strokePoints(poly.points, true);
          graphics.fillPoints(poly.points, true);
        }

        // Set active zone
        this.component.activeZoneId = 'main-ground';
        this.component.walkableGeom = this.component.walkableZones.get(
          this.component.activeZoneId
        )!.polygon;

        // Spawn tank
        const spawnX = 400;
        const spawnY = 580;

        const tank = this.add.rectangle(spawnX, spawnY, 40, 30, 0x00ff00);
        tank.setData('vy', 0);
        tank.setData('onGround', false);

        this.component.testTank = tank;

        this.input.keyboard?.addKeys({
          up: 'W',
          down: 'S',
          left: 'A',
          right: 'D'
        });

        const keyMap = this.input.keyboard?.addKeys('W,A,S,D') as
          | Record<string, Phaser.Input.Keyboard.Key>
          | undefined;
        this.component.keys = keyMap;

        if (this.component.gameState) {
          this.component.updateGameScene(this.component.gameState);
        }
      }

      override update(time: number, delta: number): void {
        this.component.updateTank(delta);
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
      scene: new GameArenaScene(this),
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };
    this.phaserGame = new Phaser.Game(config);
  }

  updateTank(delta: number): void {
    const tank = this.testTank;
    const keys = this.keys;

    if (!tank || !keys || !this.walkableGeom) return;

    const speed = 0.2 * delta;

    let dx = 0;
    let dy = 0;

    if (keys['W'].isDown) dy -= 1;
    if (keys['S'].isDown) dy += 1;
    if (keys['A'].isDown) dx -= 1;
    if (keys['D'].isDown) dx += 1;

    // Normalize diagonals
    if (dx !== 0 && dy !== 0) {
      const inv = Math.SQRT1_2;
      dx *= inv;
      dy *= inv;
    }

    // 🔮 Predict next position (DO NOT MOVE YET)
    const moveX = dx * speed;
    const moveY = dy * speed;

    const fullX = tank.x + moveX;
    const fullY = tank.y + moveY;

    // Case 1: normal movement
    if (Phaser.Geom.Polygon.Contains(this.walkableGeom, fullX, fullY)) {
      tank.x = fullX;
      tank.y = fullY;
    } else {
      // Case 2: slope-aware sliding
      const edge = this.getClosestEdge(tank.x, tank.y);

      if (edge) {
        const projected = this.projectVector(moveX, moveY, edge.x, edge.y);

        const slideX = tank.x + projected.x;
        const slideY = tank.y + projected.y;

        if (Phaser.Geom.Polygon.Contains(this.walkableGeom, slideX, slideY)) {
          tank.x = slideX;
          tank.y = slideY;
        }
      }
    }

    // 🔒 Screen bounds (still valid)
    const halfW = tank.width * tank.scaleX * 0.5;
    const halfH = tank.height * tank.scaleY * 0.5;

    tank.x = Phaser.Math.Clamp(
      tank.x,
      this.arenaBounds.minX + halfW,
      this.arenaBounds.maxX - halfW
    );

    tank.y = Phaser.Math.Clamp(
      tank.y,
      this.arenaBounds.minY + halfH,
      this.arenaBounds.maxY - halfH
    );

    // 🎭 Depth & scale
    const t = Phaser.Math.Clamp(tank.y / this.arenaBounds.maxY, 0, 1);

    tank.setScale(Phaser.Math.Linear(0.7, 1.1, t));
    tank.setDepth(Math.floor(tank.y));
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

    // Clear existing hero sprites (if any)
    const existingHeroes = this.gameScene.children.list.filter(
      child => child.getData('isHero') === true
    );
    existingHeroes.forEach(hero => hero.destroy());

    // // Determine which hero is the player and which is the opponent
    // const playerHero = state.player1.userId === this.currentUserId ? state.player1 : state.player2;
    // const opponentHero =
    //   state.player1.userId === this.currentUserId ? state.player2 : state.player1;
  }

  projectVector(vx: number, vy: number, tx: number, ty: number): { x: number; y: number } {
    const lenSq = tx * tx + ty * ty;
    if (lenSq === 0) return { x: 0, y: 0 };

    const dot = vx * tx + vy * ty;
    const scale = dot / lenSq;

    return {
      x: tx * scale,
      y: ty * scale
    };
  }
  getClosestEdge(x: number, y: number): { x: number; y: number } | null {
    const poly = this.walkableGeom.points;
    let closestDist = Infinity;
    let edgeDir: { x: number; y: number } | null = null;

    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      // approximate distance using midpoint
      const mx = (p1.x + p2.x) * 0.5;
      const my = (p1.y + p2.y) * 0.5;

      const dist = Phaser.Math.Distance.Between(x, y, mx, my);
      if (dist < closestDist) {
        closestDist = dist;
        edgeDir = { x: dx, y: dy };
      }
    }

    return edgeDir;
  }
}
