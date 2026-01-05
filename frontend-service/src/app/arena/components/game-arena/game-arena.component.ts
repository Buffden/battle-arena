import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
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
  activeZoneId = 'player-walkable-zone';
  walkableZones = new Map<string, WalkableZone>();

  // Track zone assignments for 2-player game
  private player1AssignedZone: 'left-walkable-zone' | 'right-walkable-zone' = 'left-walkable-zone';
  private player2AssignedZone: 'left-walkable-zone' | 'right-walkable-zone' = 'right-walkable-zone';

  walkableGeom!: Phaser.Geom.Polygon;
  testTank: Phaser.GameObjects.Sprite | null = null; // Current player's tank
  opponentTank: Phaser.GameObjects.Sprite | null = null; // Opponent's tank
  private playerNameTag: Phaser.GameObjects.Text | null = null; // Current player's name tag
  private opponentNameTag: Phaser.GameObjects.Text | null = null; // Opponent's name tag
  private currentPlayerName: string = 'Player 1'; // Store player name
  private opponentPlayerName: string = 'Player 2'; // Store opponent name
  private zoneAssignmentDetermined = false; // Flag to track if zones have been assigned
  private tankAngle = 0;
  private readonly tankBaseScale = 1.2;
  private readonly panzer4MergedAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  private readonly panzer4MergedTextureFiles: Record<number, string> = {
    0: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_0.png',
    45: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_45.png',
    90: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_90.png',
    135: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_135.png',
    180: 'assets/heroes/tanks/panzer_export/Merged/german_panzer__merged_180.png',
    225: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_225.png',
    270: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_270.png',
    315: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_315.png'
  };

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
  private playerPositionSubscription?: Subscription;
  private currentUserId: string | null = null;
  clickCoordinates: { x: number; y: number }[] = [];
  cursorPositionText = '';
  private cursorRafId: number | null = null;
  private pendingCursorPos: { x: number; y: number } | null = null;
  private lastPositionUpdateTime = 0;
  private readonly POSITION_UPDATE_INTERVAL = 50; // Send position updates every 50ms (20 times per second)

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {
    if (!this.matchId) {
      return;
    }

    this.currentUserId = this.authService.getUserIdFromToken();

    // Randomly assign zones to players
    this.assignZonesToPlayers();

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

        // Load zone assignments from game state if available
        if (state.zoneAssignments) {
          this.player1AssignedZone = state.zoneAssignments.player1Zone;
          this.player2AssignedZone = state.zoneAssignments.player2Zone;
        } else if (!this.hasAssignedZones()) {
          // Determine zone assignment based on sorted player IDs
          const isCurrentPlayerPlayer1 = this.currentUserId === state.player1.userId;
          const currentPlayer = isCurrentPlayerPlayer1 ? state.player1 : state.player2;
          const opponentPlayer = isCurrentPlayerPlayer1 ? state.player2 : state.player1;

          this.determineZoneAssignment(currentPlayer.userId, opponentPlayer.userId);

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

  private assignZonesToPlayers(): void {
    // Deterministic zone assignment based on player IDs
    // The logged-in player is "player1", the other is "player2"
    // If player1 ID > player2 ID, then player1 gets left zone, otherwise right zone
    // This ensures consistent, persistent zone assignment across page refreshes

    if (!this.currentUserId) {
      return;
    }

    // When game state is loaded, this will be called with actual player IDs
    // For now, mark that we need to assign zones when we have both player IDs
    this.logZoneAssignmentLogic('Initial assignment - waiting for game state');
  }

  private determineZoneAssignment(currentPlayerId: string, opponentPlayerId: string): void {
    // Deterministic assignment: compare player IDs
    const currentPlayerGetsLeft = currentPlayerId > opponentPlayerId;

    if (currentPlayerGetsLeft) {
      this.player1AssignedZone = 'left-walkable-zone';
      this.player2AssignedZone = 'right-walkable-zone';
      // eslint-disable-next-line no-console
      console.log('📊 Zone Assignment:', {
        logic: `currentPlayerId (${currentPlayerId}) > opponentPlayerId (${opponentPlayerId})`,
        result: true,
        currentPlayer: 'LEFT ZONE',
        opponent: 'RIGHT ZONE'
      });
    } else {
      this.player1AssignedZone = 'right-walkable-zone';
      this.player2AssignedZone = 'left-walkable-zone';
      // eslint-disable-next-line no-console
      console.log('📊 Zone Assignment:', {
        logic: `currentPlayerId (${currentPlayerId}) > opponentPlayerId (${opponentPlayerId})`,
        result: false,
        currentPlayer: 'RIGHT ZONE',
        opponent: 'LEFT ZONE'
      });
    }

    // Mark zones as determined and spawn tank if scene is ready
    this.zoneAssignmentDetermined = true;
    if (this.gameScene) {
      this.spawnPlayerTank();
    }
  }

  private logZoneAssignmentLogic(message: string): void {
    // eslint-disable-next-line no-console
    console.log(`🔄 Zone Assignment Status: ${message}`);
  }

  private getPlayerZone(isPlayer1: boolean): 'left-walkable-zone' | 'right-walkable-zone' {
    return isPlayer1 ? this.player1AssignedZone : this.player2AssignedZone;
  }

  private hasAssignedZones(): boolean {
    return (
      this.player1AssignedZone !== 'left-walkable-zone' ||
      this.player2AssignedZone !== 'right-walkable-zone'
    );
  }

  private saveZoneAssignmentsToBackend(): void {
    if (!this.matchId) return;

    this.gameService.sendZoneAssignments(this.matchId, {
      player1Zone: this.player1AssignedZone,
      player2Zone: this.player2AssignedZone
    });
  }

  private spawnPlayerTank(): void {
    // This method spawns the player's tank once zone assignment is determined
    if (!this.gameScene) return;

    // Don't spawn if tank already exists
    if (this.testTank) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Player tank already spawned, skipping duplicate spawn');
      return;
    }

    // We need to load arena data again to get spawn positions
    // This is a workaround - ideally we'd store spawnPositions in the component
    const arenaData = this.gameScene.cache.json.get('arena-hills-v1') as {
      spawnPositions?: {
        leftPlayer: { x: number; y: number };
        rightPlayer: { x: number; y: number };
      };
      walkableZones: {
        id: string;
        polygon: { x: number; y: number }[];
      }[];
    };

    const spawnPositions = this.calculateSpawnPositions(arenaData);

    // Determine initial tank angle based on assigned zone
    const isPlayer1InLeftZone = this.player1AssignedZone === 'left-walkable-zone';
    const initialAngle = isPlayer1InLeftZone ? 0 : 180;
    this.tankAngle = initialAngle;

    // Spawn tank in player's assigned zone
    const spawnPos = isPlayer1InLeftZone ? spawnPositions.leftSpawn : spawnPositions.rightSpawn;

    const tank = this.gameScene.add
      .sprite(spawnPos.x, spawnPos.y, this.getPanzer4TextureKey(initialAngle))
      .setOrigin(0.5, 0.5)
      .setScale(this.tankBaseScale);
    tank.setData('vy', 0);
    tank.setData('onGround', false);
    this.testTank = tank;

    // Create name tag for current player's tank
    const playerNameTag = this.gameScene.add
      .text(spawnPos.x, spawnPos.y - 50, this.currentPlayerName, {
        fontSize: '16px',
        color: '#00ff00',
        align: 'center',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      })
      .setOrigin(0.5, 1)
      .setDepth(1000);
    this.playerNameTag = playerNameTag;

    // eslint-disable-next-line no-console
    console.log('🎮 Player tank spawned at:', {
      x: spawnPos.x,
      y: spawnPos.y,
      zone: this.player1AssignedZone,
      angle: initialAngle
    });
  }

  calculateSpawnPositions(arenaData: {
    spawnPositions?: {
      leftPlayer: { x: number; y: number };
      rightPlayer: { x: number; y: number };
    };
    walkableZones: {
      id: string;
      polygon: { x: number; y: number }[];
    }[];
  }): { leftSpawn: { x: number; y: number }; rightSpawn: { x: number; y: number } } {
    // Check if arena data has predefined spawn positions
    if (arenaData.spawnPositions?.leftPlayer && arenaData.spawnPositions?.rightPlayer) {
      return {
        leftSpawn: arenaData.spawnPositions.leftPlayer,
        rightSpawn: arenaData.spawnPositions.rightPlayer
      };
    }

    // Fallback: Calculate spawn positions based on zone centroids
    const leftZone = arenaData.walkableZones.find(z => z.id === 'left-walkable-zone');
    const rightZone = arenaData.walkableZones.find(z => z.id === 'right-walkable-zone');

    const leftSpawn = leftZone ? this.getPolygonSpawnPoint(leftZone.polygon) : { x: 200, y: 400 };
    const rightSpawn = rightZone
      ? this.getPolygonSpawnPoint(rightZone.polygon)
      : { x: 1400, y: 400 };

    return { leftSpawn, rightSpawn };
  }

  private getPolygonSpawnPoint(polygon: { x: number; y: number }[]): { x: number; y: number } {
    if (polygon.length === 0) {
      return { x: 0, y: 0 };
    }

    // Calculate the centroid of the polygon
    let sumX = 0;
    let sumY = 0;

    for (const point of polygon) {
      sumX += point.x;
      sumY += point.y;
    }

    const centroid = {
      x: sumX / polygon.length,
      y: sumY / polygon.length
    };

    return centroid;
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
        for (const angle of this.component.panzer4MergedAngles) {
          const key = this.component.getPanzer4TextureKey(angle);
          const file = this.component.panzer4MergedTextureFiles[angle];
          this.load.image(key, file);
        }
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

        // Register walkable zones with distinct colors
        for (const zone of arenaData.walkableZones) {
          const flatPoints = zone.polygon.flatMap(p => [p.x, p.y]);
          const poly = new Phaser.Geom.Polygon(flatPoints);

          this.component.walkableZones.set(zone.id, { id: zone.id, polygon: poly });

          // DEBUG DRAW - Use different colors for left and right zones
          const graphics = this.add.graphics();
          const isLeftZone = zone.id === 'left-walkable-zone';
          const color = isLeftZone ? 0x0099ff : 0xff9900; // Blue for left, Orange for right
          const fillColor = isLeftZone ? 0x0099ff : 0xff9900;

          graphics.lineStyle(2, color, 1);
          graphics.fillStyle(fillColor, 0.15);
          graphics.strokePoints(poly.points, true);
          graphics.fillPoints(poly.points, true);
        }

        // Set active zone based on currently assigned zones
        // Use player1's assigned zone as the active zone for now
        this.component.activeZoneId = this.component.player1AssignedZone;
        this.component.walkableGeom = this.component.walkableZones.get(
          this.component.activeZoneId
        )!.polygon;

        // Input
        this.component.keys = this.input.keyboard?.addKeys('W,A,S,D') as
          | Record<string, Phaser.Input.Keyboard.Key>
          | undefined;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          this.component.handlePointerDown(pointer);
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          this.component.handlePointerMove(pointer);
        });

        // Spawn tank only after zone assignment is determined
        if (this.component.zoneAssignmentDetermined) {
          this.component.spawnPlayerTank();
        }
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

    const denom = Math.max(1, this.arenaBounds.maxY - this.arenaBounds.minY);
    const depthT = Phaser.Math.Clamp((tank.y - this.arenaBounds.minY) / denom, 0, 1);
    const depthScale = Phaser.Math.Linear(0.3, 2.2, depthT);
    const speed = 0.1 * delta * depthScale;

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

    if (dx !== 0 || dy !== 0) {
      const nextAngle = this.snapAngleToDirection(dx, dy);
      if (nextAngle !== this.tankAngle) {
        this.tankAngle = nextAngle;
        tank.setTexture(this.getPanzer4TextureKey(this.tankAngle));
      }
    }

    const fullX = tank.x + moveX;
    const fullY = tank.y + moveY;

    let tankMoved = false;

    if (Phaser.Geom.Polygon.Contains(this.walkableGeom, fullX, fullY)) {
      tank.x = fullX;
      tank.y = fullY;
      tankMoved = true;

      // Update name tag position
      if (this.playerNameTag) {
        this.playerNameTag.x = tank.x;
        this.playerNameTag.y = tank.y - 50;
      }

      // Log live position when tank moves
      if (dx !== 0 || dy !== 0) {
        // eslint-disable-next-line no-console
        console.log('🎮 LIVE POSITION - Current Player Tank:', {
          position: { x: Math.round(tank.x), y: Math.round(tank.y) },
          facingAngle: this.tankAngle,
          movement: { dx: dx.toFixed(2), dy: dy.toFixed(2) }
        });
      }
    } else {
      const edge = this.getClosestEdge(tank.x, tank.y);
      if (edge) {
        const projected = this.projectVector(moveX, moveY, edge.x, edge.y);
        const slideX = tank.x + projected.x;
        const slideY = tank.y + projected.y;

        if (Phaser.Geom.Polygon.Contains(this.walkableGeom, slideX, slideY)) {
          tank.x = slideX;
          tank.y = slideY;
          tankMoved = true;

          // Update name tag position
          if (this.playerNameTag) {
            this.playerNameTag.x = tank.x;
            this.playerNameTag.y = tank.y - 50;
          }

          // Log live position when tank slides along edge
          if (dx !== 0 || dy !== 0) {
            // eslint-disable-next-line no-console
            console.log('🎮 LIVE POSITION (edge slide) - Current Player Tank:', {
              position: { x: Math.round(tank.x), y: Math.round(tank.y) },
              facingAngle: this.tankAngle
            });
          }
        }
      }
    }

    tank.setScale(this.tankBaseScale * depthScale);
    tank.setDepth(Math.floor(tank.y));

    // Send position updates to backend (throttled)
    if (tankMoved && this.matchId && this.currentUserId) {
      const currentTime = Date.now();
      if (currentTime - this.lastPositionUpdateTime >= this.POSITION_UPDATE_INTERVAL) {
        this.lastPositionUpdateTime = currentTime;
        this.gameService.sendPlayerPosition(this.matchId, this.currentUserId, {
          x: tank.x,
          y: tank.y,
          facingAngle: this.tankAngle
        });
      }
    }
  }

  private updateScene(): void {
    // Update logic can be added here if needed
  }

  private updateGameScene(state: GameState): void {
    if (!this.gameScene) return;

    // Update the active zone based on whose turn it is
    const isPlayer1Turn = state.currentTurn === state.player1.userId;
    const activeZone = this.getPlayerZone(isPlayer1Turn);

    if (activeZone !== this.activeZoneId) {
      this.activeZoneId = activeZone;
      this.walkableGeom = this.walkableZones.get(this.activeZoneId)!.polygon;
    }

    // Determine if current player is player1 or player2
    const isCurrentPlayerPlayer1 = this.currentUserId === state.player1.userId;
    const currentPlayer = isCurrentPlayerPlayer1 ? state.player1 : state.player2;
    const opponentPlayer = isCurrentPlayerPlayer1 ? state.player2 : state.player1;

    // Update player names
    this.currentPlayerName = currentPlayer.userId;

    // Update name tag text if it exists
    if (this.playerNameTag) {
      this.playerNameTag.setText(this.currentPlayerName);
    }

    // Console log player and opponent details
    // eslint-disable-next-line no-console
    console.log('=== GAME ARENA PLAYER DETAILS ===');
    // eslint-disable-next-line no-console
    console.log('Current Player:', {
      userId: currentPlayer.userId,
      heroId: currentPlayer.heroId,
      position: { x: currentPlayer.position.x, y: currentPlayer.position.y },
      facingAngle: currentPlayer.facingAngle,
      health: currentPlayer.health,
      zone: isCurrentPlayerPlayer1 ? this.player1AssignedZone : this.player2AssignedZone,
      isMyTurn: state.currentTurn === this.currentUserId
    });
    // eslint-disable-next-line no-console
    console.log('Opponent Player:', {
      userId: opponentPlayer.userId,
      heroId: opponentPlayer.heroId,
      position: { x: opponentPlayer.position.x, y: opponentPlayer.position.y },
      facingAngle: opponentPlayer.facingAngle,
      health: opponentPlayer.health,
      zone: isCurrentPlayerPlayer1 ? this.player2AssignedZone : this.player1AssignedZone,
      isTheirTurn: state.currentTurn === opponentPlayer.userId
    });
    // eslint-disable-next-line no-console
    console.log('===================================');

    // Create or update opponent tank
    this.renderOpponentTank(opponentPlayer, state);
  }

  private renderOpponentTank(opponentPlayer: any, state: GameState): void {
    if (!this.gameScene) return;

    // Determine opponent's zone and initial angle
    const isCurrentPlayerPlayer1 = this.currentUserId === state.player1.userId;
    const opponentIsPlayer1 = !isCurrentPlayerPlayer1;
    const opponentZone = opponentIsPlayer1 ? this.player1AssignedZone : this.player2AssignedZone;
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
        walkableZones: {
          id: string;
          polygon: { x: number; y: number }[];
        }[];
      };

      const spawnPositions = this.calculateSpawnPositions(arenaData);
      const opponentSpawnPos =
        opponentZone === 'left-walkable-zone'
          ? spawnPositions.leftSpawn
          : spawnPositions.rightSpawn;

      // Create opponent tank sprite at their correct spawn position
      this.opponentTank = this.gameScene.add
        .sprite(opponentSpawnPos.x, opponentSpawnPos.y, this.getPanzer4TextureKey(opponentAngle))
        .setOrigin(0.5, 0.5)
        .setScale(this.tankBaseScale);
      this.opponentTank.setData('isOpponent', true);

      // Create name tag for opponent's tank
      this.opponentNameTag = this.gameScene.add
        .text(opponentSpawnPos.x, opponentSpawnPos.y - 50, this.opponentPlayerName, {
          fontSize: '16px',
          color: '#ff0000',
          align: 'center',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        })
        .setOrigin(0.5, 1)
        .setDepth(1000);

      // eslint-disable-next-line no-console
      console.log('👥 Opponent Tank Created:', {
        userId: opponentPlayer.userId,
        spawnPosition: { x: opponentSpawnPos.x, y: opponentSpawnPos.y },
        zone: opponentZone,
        initialAngle: opponentAngle
      });
    } else {
      // Update opponent tank position and angle
      this.opponentTank.x = opponentPlayer.position.x;
      this.opponentTank.y = opponentPlayer.position.y;
      const opponentFacingAngle = opponentPlayer.facingAngle || opponentAngle;
      this.opponentTank.setTexture(this.getPanzer4TextureKey(opponentFacingAngle));

      // Update opponent name tag position
      if (this.opponentNameTag) {
        this.opponentNameTag.x = opponentPlayer.position.x;
        this.opponentNameTag.y = opponentPlayer.position.y - 50;
      }

      // eslint-disable-next-line no-console
      console.log('👥 Opponent Tank Updated:', {
        userId: opponentPlayer.userId,
        position: {
          x: Math.round(opponentPlayer.position.x),
          y: Math.round(opponentPlayer.position.y)
        },
        facingAngle: opponentFacingAngle
      });
    }
  }

  private updateOpponentPosition(position: { x: number; y: number; facingAngle: number }): void {
    if (!this.opponentTank || !this.gameScene) return;

    // Update opponent tank position
    this.opponentTank.x = position.x;
    this.opponentTank.y = position.y;

    // Update opponent tank texture based on facing angle
    this.opponentTank.setTexture(this.getPanzer4TextureKey(position.facingAngle));

    // Update depth based on y position
    const denom = Math.max(1, this.arenaBounds.maxY - this.arenaBounds.minY);
    const depthT = Phaser.Math.Clamp((position.y - this.arenaBounds.minY) / denom, 0, 1);
    const depthScale = Phaser.Math.Linear(0.3, 2.2, depthT);
    this.opponentTank.setScale(this.tankBaseScale * depthScale);
    this.opponentTank.setDepth(Math.floor(position.y));

    // Update opponent name tag position
    if (this.opponentNameTag) {
      this.opponentNameTag.x = position.x;
      this.opponentNameTag.y = position.y - 50;
    }

    // eslint-disable-next-line no-console
    console.log('🔄 Real-time Opponent Position Update:', {
      position: { x: Math.round(position.x), y: Math.round(position.y) },
      facingAngle: position.facingAngle
    });
  }

  private getPanzer4TextureKey(angle: number): string {
    return `panzer4-merged-${angle}`;
  }

  private snapAngleToDirection(dx: number, dy: number): number {
    const rawDeg = Phaser.Math.RadToDeg(Math.atan2(-dy, dx));
    const normalized = (rawDeg + 360) % 360;
    const snapped = Math.round(normalized / 45) * 45;
    return snapped % 360;
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const x = Math.round(pointer.worldX);
    const y = Math.round(pointer.worldY);
    this.clickCoordinates.push({ x, y });
    // Log the full click history as requested.
    // eslint-disable-next-line no-console
    console.log(this.clickCoordinates);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    this.pendingCursorPos = {
      x: Math.round(pointer.worldX),
      y: Math.round(pointer.worldY)
    };

    if (this.cursorRafId !== null) return;

    this.cursorRafId = globalThis.requestAnimationFrame(() => {
      const pos = this.pendingCursorPos;
      this.pendingCursorPos = null;
      this.cursorRafId = null;
      if (!pos) return;

      this.zone.run(() => {
        this.cursorPositionText = `X: ${pos.x}, Y: ${pos.y}`;
      });
    });
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
