import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as Phaser from 'phaser';
import { GameService } from '../../../services/game.service';
import { GameState, WalkableZone } from '../../../types/game.types';
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

    // TEMP: initialize Phaser locally for movement/terrain work
    this.initializePhaser();

    this.gameService.gameJoined$.subscribe(data => {
      if (data && data.message === 'Waiting for opponent...') {
        this.waitingForOpponent = true;
      }
    });

    this.gameStateSubscription = this.gameService.getGameState().subscribe(state => {
      if (state) {
        this.gameState = state;
        this.waitingForOpponent = false;
        this.updateGameScene(state);
      }
    });

    this.gameErrorSubscription = this.gameService.getGameErrors().subscribe(_error => {});
  }

  private onWindowResize(): void {
    if (!this.phaserGame) return;

    const viewportWidth = globalThis.window?.innerWidth || 800;
    const viewportHeight = globalThis.window?.innerHeight || 600;
    this.phaserGame.scale.resize(viewportWidth, viewportHeight);
  }

  drawWalkablePolygon(scene: Phaser.Scene): void {
    if (!this.walkableGeom) return;

    const graphics = scene.add.graphics();

    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.fillStyle(0x00ff00, 0.15);

    const poly = this.walkableGeom.points;

    graphics.beginPath();
    graphics.moveTo(poly[0].x, poly[0].y);

    for (let i = 1; i < poly.length; i++) graphics.lineTo(poly[i].x, poly[i].y);
    graphics.closePath();
    graphics.strokePath();
    graphics.fillPath();
    graphics.setDepth(9999);
  }

  ngOnDestroy(): void {
    if (globalThis.window) {
      globalThis.window.removeEventListener('resize', this.onWindowResize);
    }

    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
      this.gameScene = null;
    }

    this.gameStateSubscription?.unsubscribe();
    this.gameErrorSubscription?.unsubscribe();

    this.gameService.disconnect();
  }

  private initializePhaser(): void {
    if (this.phaserGame) return;

    class GameArenaScene extends Phaser.Scene {
      private readonly component: GameArenaComponent;

      constructor(component: GameArenaComponent) {
        super({ key: 'GameArenaScene' });
        this.component = component;
      }

      preload(): void {
        this.load.json('arena-hills-v1', 'assets/arenas/arena-hills-v1.json');
        this.load.image('arena-02', 'assets/arenas/arena-02.png');
      }

      create(): void {
        this.component.gameScene = this;
        this.add.image(0, 0, 'arena-02').setOrigin(0, 0);
        const backgroundImage = this.add.image(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          'arena-02'
        );

        // Scale to fit viewport
        backgroundImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Set depth so other objects appear on top
        backgroundImage.setDepth(0);

        const arenaData = this.cache.json.get('arena-hills-v1') as {
          worldBounds: { x: number; y: number; width: number; height: number };
          walkableZones: {
            id: string;
            polygon: { x: number; y: number }[];
          }[];
        };

        const { x, y, width, height } = arenaData.worldBounds;

        // Authoritative arena bounds
        this.component.arenaBounds = {
          minX: x,
          minY: y,
          maxX: x + width,
          maxY: y + height
        };

        // Camera bound to arena (world space)
        this.cameras.main.setBounds(x, y, width, height);

        // Register walkable zones
        for (const zone of arenaData.walkableZones) {
          const flatPoints = zone.polygon.flatMap(p => [p.x, p.y]);
          const poly = new Phaser.Geom.Polygon(flatPoints);

          this.component.walkableZones.set(zone.id, { id: zone.id, polygon: poly });

          // DEBUG DRAW
          const graphics = this.add.graphics();
          graphics.lineStyle(2, 0x00ff00, 1);
          graphics.fillStyle(0x00ff00, 0.15);
          graphics.strokePoints(poly.points, true);
          graphics.fillPoints(poly.points, true);
        }

        // Active zone
        this.component.activeZoneId = 'main-ground';
        this.component.walkableGeom = this.component.walkableZones.get(
          this.component.activeZoneId
        )!.polygon;

        // Spawn tank
        const tank = this.add.rectangle(400, 580, 40, 30, 0x00ff00);
        tank.setData('vy', 0);
        tank.setData('onGround', false);
        this.component.testTank = tank;

        // Input
        this.component.keys = this.input.keyboard?.addKeys('W,A,S,D') as
          | Record<string, Phaser.Input.Keyboard.Key>
          | undefined;

        // Optional initial camera center
        // this.updateCamera([tank]);
      }

      override update(_time: number, delta: number): void {
        this.component.updateTank(delta);

        // if (this.component.testTank) {
        //   this.updateCamera([this.component.testTank]);
        // }
      }

      private updateCamera(players: Phaser.GameObjects.GameObject[]): void {
        const cam = this.cameras.main;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const p of players) {
          const obj = p as Phaser.GameObjects.GameObject & { x: number; y: number };
          minX = Math.min(minX, obj.x);
          minY = Math.min(minY, obj.y);
          maxX = Math.max(maxX, obj.x);
          maxY = Math.max(maxY, obj.y);
        }

        const padding = 200;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;

        cam.centerOn(centerX, centerY);
      }
    }

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

    if (keys['W']?.isDown) dy -= 1;
    if (keys['S']?.isDown) dy += 1;
    if (keys['A']?.isDown) dx -= 1;
    if (keys['D']?.isDown) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const inv = Math.SQRT1_2;
      dx *= inv;
      dy *= inv;
    }

    const moveX = dx * speed;
    const moveY = dy * speed;

    const fullX = tank.x + moveX;
    const fullY = tank.y + moveY;

    if (Phaser.Geom.Polygon.Contains(this.walkableGeom, fullX, fullY)) {
      tank.x = fullX;
      tank.y = fullY;
    } else {
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

    const denom = Math.max(1, this.arenaBounds.maxY - this.arenaBounds.minY);
    const t = Phaser.Math.Clamp((tank.y - this.arenaBounds.minY) / denom, 0, 1);

    tank.setScale(Phaser.Math.Linear(0.7, 1.1, t));
    tank.setDepth(Math.floor(tank.y));
  }

  private updateScene(): void {
    // Update logic can be added here if needed
  }

  private updateGameScene(_state: GameState): void {
    if (!this.gameScene) return;

    const existingHeroes = this.gameScene.children.list.filter(
      child => child.getData('isHero') === true
    );
    existingHeroes.forEach(hero => hero.destroy());
  }

  projectVector(vx: number, vy: number, tx: number, ty: number): { x: number; y: number } {
    const lenSq = tx * tx + ty * ty;
    if (lenSq === 0) return { x: 0, y: 0 };

    const dot = vx * tx + vy * ty;
    const scale = dot / lenSq;

    return { x: tx * scale, y: ty * scale };
  }
  getClosestEdge(x: number, y: number): { x: number; y: number } | null {
    if (!this.walkableGeom) return null;

    const poly = this.walkableGeom.points;
    let closestDist = Infinity;
    let edgeDir: { x: number; y: number } | null = null;

    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

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
