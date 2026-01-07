import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as Phaser from 'phaser';
import { GameService } from '../../../services/game.service';
import { GameState } from '../../../types/game.types';
import { gameConfig } from '../../../config/game.config';
import { AuthService } from '../../../services/auth.service';
import { ArenaScalingService } from '../../services/arena-scaling.service';
import { TankSpawnerService } from '../../services/tank-spawner.service';
import { TankMovementService } from '../../services/tank-movement.service';
import { OpponentSyncService } from '../../services/opponent-sync.service';
import { ZoneAssignmentService } from '../../services/zone-assignment.service';
import { ArenaInputService } from '../../services/arena-input.service';
@Component({
  selector: 'app-game-arena',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-arena.component.html',
  styleUrl: './game-arena.component.css'
})
export class GameArenaComponent implements OnInit, OnDestroy {
  @Input() matchId: string | null = null;
  activeZoneId = 'player-walkable-zone';

  walkableGeom!: Phaser.Geom.Polygon;
  testTank: Phaser.GameObjects.Sprite | null = null;
  opponentTank: Phaser.GameObjects.Sprite | null = null;
  private playerNameTag: Phaser.GameObjects.Text | null = null;
  private opponentNameTag: Phaser.GameObjects.Text | null = null;
  private currentPlayerName: string = 'Player 1';
  private opponentPlayerName: string = 'Player 2';
  private tankAngle = 0;

  gameState: GameState | null = null;
  gameScene: Phaser.Scene | null = null;
  phaserGame: Phaser.Game | null = null;
  waitingForOpponent = false;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;

  private gameStateSubscription?: Subscription;
  private gameErrorSubscription?: Subscription;
  private playerPositionSubscription?: Subscription;
  private currentUserId: string | null = null;
  cursorPositionText = '';
  private cursorRafId: number | null = null;
  private lastPositionUpdateTime = 0;
  private readonly POSITION_UPDATE_INTERVAL = 50;
  private clickedPoints: { x: number; y: number }[] = [];

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService,
    private readonly zone: NgZone,
    private readonly scalingService: ArenaScalingService,
    private readonly spawnerService: TankSpawnerService,
    private readonly movementService: TankMovementService,
    private readonly opponentService: OpponentSyncService,
    private readonly zoneService: ZoneAssignmentService,
    private readonly inputService: ArenaInputService
  ) {}

  ngOnInit(): void {
    if (!this.matchId) {
      return;
    }

    const initialWidth = globalThis.window?.innerWidth || 1024;
    const initialHeight = globalThis.window?.innerHeight || 768;
    // eslint-disable-next-line no-console
    console.log(
      `📐 Initial Screen Dimensions - Width: ${initialWidth}px, Height: ${initialHeight}px`
    );

    this.currentUserId = this.authService.getUserIdFromToken();
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

        // Load zone assignments from game state if available
        if (state.zoneAssignments) {
          this.zoneService.setAssignedZones(
            state.zoneAssignments.player1Zone,
            state.zoneAssignments.player2Zone
          );
        } else if (!this.zoneService.isZoneAssignmentDetermined()) {
          // Determine zone assignment based on sorted player IDs
          this.zoneService.determineZoneAssignment(state.player1.userId, state.player2.userId);

          // Save the determined assignments to backend
          this.saveZoneAssignmentsToBackend();
        }

        this.updateGameScene(state);
      }
    });

    this.gameErrorSubscription = this.gameService.getGameErrors().subscribe(_error => {});

    // Subscribe to real-time player position updates
    this.playerPositionSubscription = this.gameService.playerPosition$.subscribe(data => {
      // Only update if it's the opponent's position
      if (data.userId !== this.currentUserId) {
        this.updateOpponentPosition(data.position);
      }
    });

    // Handle window resize for fullscreen
    if (globalThis.window) {
      this.onWindowResize = this.onWindowResize.bind(this);
      globalThis.window.addEventListener('resize', this.onWindowResize);
    }
  }

  ngOnDestroy(): void {
    if (globalThis.window) {
      globalThis.window.removeEventListener('resize', this.onWindowResize);
    }

    if (this.cursorRafId !== null) {
      globalThis.cancelAnimationFrame(this.cursorRafId);
      this.cursorRafId = null;
    }

    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
      this.gameScene = null;
      this.testTank = null;
      this.opponentTank = null;
      this.playerNameTag = null;
      this.opponentNameTag = null;
    }

    this.gameStateSubscription?.unsubscribe();
    this.gameErrorSubscription?.unsubscribe();
    this.playerPositionSubscription?.unsubscribe();

    this.gameService.disconnect();
  }

  private onWindowResize(): void {
    if (!this.phaserGame) return;

    const viewportWidth = globalThis.window?.innerWidth || 800;
    const viewportHeight = globalThis.window?.innerHeight || 600;

    // eslint-disable-next-line no-console
    console.log(
      `📐 Window Resized - New Width: ${viewportWidth}px, New Height: ${viewportHeight}px`
    );

    // Compute previous scale before changing dimensions
    const prevScale = this.scalingService.getScaleFactors();

    this.phaserGame.scale.resize(viewportWidth, viewportHeight);

    // Update dimensions and rescale polygons & bounds
    this.scalingService.updateDimensions(viewportWidth, viewportHeight);
    const newScale = this.scalingService.getScaleFactors();
    const ratioX = newScale.x / Math.max(prevScale.x, 1e-6);
    const ratioY = newScale.y / Math.max(prevScale.y, 1e-6);

    this.scalingService.rescaleAllPolygons();
    this.scalingService.rescaleArenaBounds();

    // Adjust current tank and opponent positions to remain inside rescaled polygons
    if (this.testTank) {
      this.testTank.x *= ratioX;
      this.testTank.y *= ratioY;
      if (this.playerNameTag) {
        this.playerNameTag.x = this.testTank.x;
        this.playerNameTag.y = this.testTank.y - 50;
      }
    }

    if (this.opponentTank) {
      this.opponentTank.x *= ratioX;
      this.opponentTank.y *= ratioY;
      if (this.opponentNameTag) {
        this.opponentNameTag.x = this.opponentTank.x;
        this.opponentNameTag.y = this.opponentTank.y - 50;
      }
    }

    // Update active zone if it exists
    const zoneId = this.activeZoneId;
    const scaledZone = this.scalingService.getWalkableZone(zoneId);
    if (scaledZone) {
      this.walkableGeom = scaledZone;
    }
  }

  private saveZoneAssignmentsToBackend(): void {
    if (!this.matchId) return;
    const zones = this.zoneService.getAssignedZones();
    this.gameService.sendZoneAssignments(this.matchId, {
      player1Zone: zones.player1Zone,
      player2Zone: zones.player2Zone
    });
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

        // Load tank textures from spawnerService
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        for (const angle of angles) {
          const key = this.component.spawnerService.getPanzer4TextureKey(angle);
          const file = this.component.spawnerService.getPanzer4TextureFile(angle);
          this.load.image(key, file);
        }
      }

      create(): void {
        this.component.gameScene = this;

        // Add background image
        this.add.image(0, 0, 'arena-02').setOrigin(0, 0);
        const backgroundImage = this.add.image(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          'arena-02'
        );
        backgroundImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        backgroundImage.setDepth(0);

        // Load arena data
        const arenaData = this.cache.json.get('arena-hills-v1') as {
          worldBounds?: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            referenceArenaWidth?: number;
            referenceArenaHeight?: number;
          };
          spawnPositions?: {
            leftPlayer: { x: number; y: number };
            rightPlayer: { x: number; y: number };
          };
          walkableZones: {
            id: string;
            polygon: { x: number; y: number }[];
          }[];
        };

        const DEFAULT_REF_WIDTH = 1511;
        const DEFAULT_REF_HEIGHT = 860;

        const worldBounds = arenaData.worldBounds || {};
        const referenceArenaWidth = worldBounds.referenceArenaWidth ?? DEFAULT_REF_WIDTH;
        const referenceArenaHeight = worldBounds.referenceArenaHeight ?? DEFAULT_REF_HEIGHT;
        const boundsX = worldBounds.x ?? 0;
        const boundsY = worldBounds.y ?? 0;
        const boundsWidth = worldBounds.width ?? referenceArenaWidth;
        const boundsHeight = worldBounds.height ?? referenceArenaHeight;

        // Initialize scaling service with arena dimensions
        const currentWidth = globalThis.window?.innerWidth || 1024;
        const currentHeight = globalThis.window?.innerHeight || 768;
        this.component.scalingService.initializeFromArenaData(
          referenceArenaWidth,
          referenceArenaHeight,
          currentWidth,
          currentHeight
        );

        // Set camera bounds
        this.cameras.main.setBounds(boundsX, boundsY, boundsWidth, boundsHeight);

        // Register walkable zones with scaling service
        const scales = this.component.scalingService.getScaleFactors();
        for (const zone of arenaData.walkableZones) {
          // Check if polygon coordinates are in percentage format (0-1 range)
          const polygon = zone.polygon.map(point => {
            const isPercentage = point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1;
            if (isPercentage) {
              // Convert percentage to pixel coordinates using reference dimensions
              return {
                x: point.x * referenceArenaWidth,
                y: point.y * referenceArenaHeight
              };
            }
            return point;
          });

          this.component.scalingService.registerWalkableZone(zone.id, polygon, scales.x, scales.y);
        }

        // Get scaled zones for rendering
        for (const zone of arenaData.walkableZones) {
          const scaledZone = this.component.scalingService.getWalkableZone(zone.id);
          if (scaledZone) {
            // DEBUG DRAW - visualize zones
            const graphics = this.add.graphics();
            let color = 0xff9900; // default orange
            if (zone.id === 'left-walkable-zone') {
              color = 0x0099ff; // blue
            } else if (zone.id === 'new') {
              color = 0xaa00ff; // purple for the new polygon
            }
            graphics.lineStyle(2, color, 1);
            graphics.fillStyle(color, 0.15);
            graphics.strokePoints(scaledZone.points, true);
            graphics.fillPoints(scaledZone.points, true);
          }
        }

        // Store arena bounds in scaling service
        this.component.scalingService.rescaleArenaBounds({
          x: boundsX,
          y: boundsY,
          width: boundsWidth,
          height: boundsHeight
        });

        // Set up input
        this.component.keys = this.component.inputService.initializeKeyboard(this.input);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          this.component.handlePointerDown(pointer);
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          this.component.handlePointerMove(pointer);
        });
      }

      override update(_time: number, delta: number): void {
        this.component.updateTank(delta);
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

    const result = this.movementService.updateTank(
      delta,
      tank,
      keys,
      this.walkableGeom,
      this.scalingService.arenaBounds,
      this.tankAngle,
      this.playerNameTag
    );

    if (result.newAngle !== this.tankAngle) {
      this.tankAngle = result.newAngle;
      tank.setTexture(this.spawnerService.getPanzer4TextureKey(this.tankAngle));
    }

    // Send position updates to backend (throttled)
    if (result.moved && this.matchId && this.currentUserId) {
      const currentTime = Date.now();
      if (currentTime - this.lastPositionUpdateTime >= this.POSITION_UPDATE_INTERVAL) {
        this.lastPositionUpdateTime = currentTime;

        // Send as viewport-normalized ratios (0–1) for responsive layouts
        const { width: currentWidth, height: currentHeight } =
          this.scalingService.getCurrentDimensions();
        this.gameService.sendPlayerPosition(this.matchId, this.currentUserId, {
          x: tank.x / currentWidth,
          y: tank.y / currentHeight,
          facingAngle: this.tankAngle
        });
      }
    }
  }

  private updateGameScene(state: GameState): void {
    if (!this.gameScene) return;

    // Determine zones
    const isPlayer1Turn = state.currentTurn === state.player1.userId;
    const zones = this.zoneService.getAssignedZones();
    const activeZone = isPlayer1Turn ? zones.player1Zone : zones.player2Zone;
    const isCurrentPlayerPlayer1 = this.currentUserId === state.player1.userId;
    const playerZone = isCurrentPlayerPlayer1 ? zones.player1Zone : zones.player2Zone;

    // Keep activeZoneId for any UI needs, but movement uses playerZone
    this.activeZoneId = activeZone;

    const playerScaledZone = this.scalingService.getWalkableZone(playerZone);
    if (playerScaledZone) {
      this.walkableGeom = playerScaledZone;
    }

    // Determine if current player is player1 or player2
    const currentPlayer = isCurrentPlayerPlayer1 ? state.player1 : state.player2;
    const opponentPlayer = isCurrentPlayerPlayer1 ? state.player2 : state.player1;

    // Update player names
    this.currentPlayerName = currentPlayer.userId;

    // Update name tag text if it exists
    if (this.playerNameTag) {
      this.playerNameTag.setText(this.currentPlayerName);
    }

    // Spawn local player tank once
    if (!this.testTank) {
      const arenaData = this.gameScene.cache.json.get('arena-hills-v1') as {
        spawnPositions?: {
          leftPlayer: { x: number; y: number };
          rightPlayer: { x: number; y: number };
        };
      };

      const scales = this.scalingService.getScaleFactors();
      const { width: currentWidth, height: currentHeight } =
        this.scalingService.getCurrentDimensions();
      const spawnPositions = this.spawnerService.calculateSpawnPositions(
        arenaData,
        scales.x,
        scales.y,
        currentWidth,
        currentHeight
      );
      const mySpawn =
        playerZone === 'left-walkable-zone' ? spawnPositions.leftSpawn : spawnPositions.rightSpawn;

      // Face toward center: left zone -> 0°, right zone -> 180°
      this.tankAngle = playerZone === 'left-walkable-zone' ? 0 : 180;
      const textureKey = this.spawnerService.getPanzer4TextureKey(this.tankAngle);
      const baseScale = this.opponentService.getTankBaseScale();

      const tank = this.gameScene.add
        .sprite(mySpawn.x, mySpawn.y, textureKey)
        .setOrigin(0.5, 0.5)
        .setScale(baseScale);

      const nameTag = this.gameScene.add
        .text(mySpawn.x, mySpawn.y - 50, this.currentPlayerName, {
          fontSize: '16px',
          color: '#00ff00',
          align: 'center',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        })
        .setOrigin(0.5, 1)
        .setDepth(1000);

      this.testTank = tank;
      this.playerNameTag = nameTag;

      // Seed walkable geometry if not yet set
      if (!this.walkableGeom) {
        const initialZone = this.scalingService.getWalkableZone(playerZone);
        if (initialZone) {
          this.walkableGeom = initialZone;
        }
      }
    }
    // Create or update opponent tank
    this.renderOpponentTank(opponentPlayer, state);
  }

  private renderOpponentTank(opponentPlayer: any, state: GameState): void {
    if (!this.gameScene) return;

    // Determine opponent's zone and initial angle
    const isCurrentPlayerPlayer1 = this.currentUserId === state.player1.userId;
    const opponentIsPlayer1 = !isCurrentPlayerPlayer1;
    const zones = this.zoneService.getAssignedZones();
    const opponentZone = opponentIsPlayer1 ? zones.player1Zone : zones.player2Zone;
    const opponentAngle = opponentZone === 'left-walkable-zone' ? 0 : 180;

    // Store opponent name
    this.opponentPlayerName = opponentPlayer.userId;

    if (!this.opponentTank) {
      // Calculate opponent's spawn position based on their assigned zone
      const arenaData = this.gameScene.cache.json.get('arena-hills-v1') as {
        spawnPositions?: {
          leftPlayer: { x: number; y: number };
          rightPlayer: { x: number; y: number };
        };
      };

      const scales = this.scalingService.getScaleFactors();
      const { width: currentWidth, height: currentHeight } =
        this.scalingService.getCurrentDimensions();

      const spawnPositions = this.spawnerService.calculateSpawnPositions(
        arenaData,
        scales.x,
        scales.y,
        currentWidth,
        currentHeight
      );
      const opponentSpawnPos =
        opponentZone === 'left-walkable-zone'
          ? spawnPositions.leftSpawn
          : spawnPositions.rightSpawn;

      // Create opponent tank sprite at their correct spawn position
      const textureKey = this.spawnerService.getPanzer4TextureKey(opponentAngle);
      const { tank, nameTag } = this.opponentService.createOpponentTank(
        this.gameScene,
        opponentSpawnPos,
        textureKey,
        this.opponentPlayerName
      );

      this.opponentTank = tank;
      this.opponentNameTag = nameTag;
    } else {
      // Update opponent tank position and angle
      const opponentFacingAngle = opponentPlayer.facingAngle || opponentAngle;
      const textureKey = this.spawnerService.getPanzer4TextureKey(opponentFacingAngle);
      const { width: currentWidth, height: currentHeight } =
        this.scalingService.getCurrentDimensions();
      const scaledPos = {
        x: opponentPlayer.position.x * currentWidth,
        y: opponentPlayer.position.y * currentHeight,
        facingAngle: opponentFacingAngle
      };

      this.opponentService.updateOpponentTankPosition(
        this.opponentTank,
        this.opponentNameTag,
        scaledPos,
        textureKey,
        this.scalingService.arenaBounds
      );
    }
  }

  private updateOpponentPosition(position: { x: number; y: number; facingAngle: number }): void {
    if (!this.opponentTank || !this.gameScene) return;

    // Scale position from server ratios (0–1) to viewport pixels
    const { width: currentWidth, height: currentHeight } =
      this.scalingService.getCurrentDimensions();
    const scaledPos = {
      x: position.x * currentWidth,
      y: position.y * currentHeight,
      facingAngle: position.facingAngle
    };

    // Update opponent tank texture based on facing angle
    const textureKey = this.spawnerService.getPanzer4TextureKey(scaledPos.facingAngle);

    this.opponentService.updateOpponentTankPosition(
      this.opponentTank,
      this.opponentNameTag,
      scaledPos,
      textureKey,
      this.scalingService.arenaBounds
    );
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    this.inputService.handlePointerDown(pointer);

    // Calculate and log click position in both pixel and percentage coordinates
    const clickPercent = this.calculateClickPercentage(pointer.worldX, pointer.worldY);
    // eslint-disable-next-line no-console
    console.log(
      `🖱️ Click Position - Pixels: (${Math.round(pointer.worldX)}, ${Math.round(pointer.worldY)}) | Percentage:`,
      clickPercent
    );
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    const pos = this.inputService.handlePointerMove(pointer);

    if (this.cursorRafId !== null) return;

    this.cursorRafId = globalThis.requestAnimationFrame(() => {
      this.zone.run(() => {
        this.cursorPositionText = `X: ${pos.x}, Y: ${pos.y}`;
      });
      this.cursorRafId = null;
    });
  }

  /**
   * Calculate clicked point coordinates and convert to percentage (0-1 scale)
   * based on reference arena dimensions (1511x860).
   * Accumulates all clicked points in an array.
   * @param pixelX X coordinate in pixels
   * @param pixelY Y coordinate in pixels
   * @returns Array of all clicked points with percentage coordinates (0-1 range)
   */
  private calculateClickPercentage(pixelX: number, pixelY: number): { x: number; y: number }[] {
    const REFERENCE_WIDTH = 1511;
    const REFERENCE_HEIGHT = 860;

    const newPoint = {
      x: pixelX / REFERENCE_WIDTH,
      y: pixelY / REFERENCE_HEIGHT
    };

    this.clickedPoints.push(newPoint);
    return this.clickedPoints;
  }

  /**
   * Clear all accumulated clicked points.
   */
  private clearClickedPoints(): void {
    this.clickedPoints = [];
  }
}
