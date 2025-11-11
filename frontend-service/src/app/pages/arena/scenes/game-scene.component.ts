import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService, GameState } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-scene',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="game-container" *ngIf="gameState">
      <!-- Game Status -->
      <div class="game-status">
        <div class="player-info" *ngFor="let player of gameState.players">
          <span class="username">{{ player.username }}</span>
          <div class="health-bar">
            <div class="health-fill" [style.width.%]="player.health"></div>
          </div>
          <span class="score">Score: {{ player.score }}</span>
        </div>
      </div>

      <!-- Game Canvas -->
      <canvas #gameCanvas class="game-canvas"></canvas>

      <!-- Controls -->
      <div class="game-controls">
        <div class="power-meter">
          <div class="power-fill" [style.height.%]="power"></div>
        </div>
        <div class="angle-indicator" [style.transform]="'rotate(' + angle + 'deg)'"></div>
        <button (mousedown)="startCharging()" (mouseup)="fire()" (mouseleave)="cancelCharging()">
          Fire
        </button>
      </div>

      <!-- Settings Panel -->
      <div class="settings-panel" *ngIf="showSettings">
        <h3>Game Settings</h3>
        <div class="setting-group">
          <label>Game Mode</label>
          <select [(ngModel)]="selectedMode" (change)="applyGameMode()">
            <option value="classic">Classic</option>
            <option value="team">Team Battle</option>
            <option value="freeForAll">Free for All</option>
          </select>
        </div>
        <div class="setting-group">
          <label>Weather</label>
          <select [(ngModel)]="selectedWeather" (change)="updateWeather()">
            <option value="clear">Clear</option>
            <option value="rain">Rain</option>
            <option value="wind">Wind</option>
          </select>
          <input type="range" [(ngModel)]="weatherIntensity" (change)="updateWeather()" min="0" max="100">
        </div>
        <button (click)="resetSettings()">Reset Settings</button>
      </div>

      <!-- Error Messages -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      position: relative;
      width: 100%;
      height: 100vh;
      background: #1a1a1a;
      color: white;
    }

    .game-status {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
    }

    .player-info {
      margin-bottom: 10px;
    }

    .health-bar {
      width: 200px;
      height: 20px;
      background: #333;
      border-radius: 10px;
      overflow: hidden;
    }

    .health-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s ease;
    }

    .game-canvas {
      width: 100%;
      height: 100%;
    }

    .game-controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .power-meter {
      width: 20px;
      height: 100px;
      background: #333;
      border-radius: 10px;
      overflow: hidden;
    }

    .power-fill {
      width: 100%;
      background: #f44336;
      transition: height 0.1s linear;
    }

    .angle-indicator {
      width: 2px;
      height: 50px;
      background: white;
      transform-origin: bottom center;
    }

    .settings-panel {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 10px;
    }

    .setting-group {
      margin-bottom: 15px;
    }

    .error-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(244, 67, 54, 0.9);
      padding: 20px;
      border-radius: 10px;
      z-index: 100;
    }
  `]
})
export class GameSceneComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  errorMessage: string = '';
  showSettings: boolean = false;
  selectedMode: string = 'classic';
  selectedWeather: string = 'clear';
  weatherIntensity: number = 0;
  power: number = 0;
  angle: number = 45;
  private charging: boolean = false;
  private chargeInterval: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('GameSceneComponent initialized');
    
    // Get room ID from route params and join the room
    this.route.params.subscribe(params => {
      const roomId = params['roomId'];
      console.log('Room ID from route:', roomId);
      // Always call joinRoom immediately to ensure socket connection is attempted
      this.gameService.joinRoom(roomId);
    });

    this.subscriptions.push(
      this.gameService.getGameState().subscribe(state => {
        this.gameState = state;
        console.log('Game state updated in component:', state);
      }),
      this.gameService.getErrors().subscribe(error => {
        this.errorMessage = error;
        console.error('Game error in component:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      })
    );
  }

  ngOnDestroy() {
    console.log('GameSceneComponent destroyed');
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.gameService.disconnect();
  }

  startCharging() {
    console.log('Started charging shot');
    this.charging = true;
    this.power = 0;
    this.chargeInterval = setInterval(() => {
      if (this.power < 100) {
        this.power += 2;
      } else {
        this.power = 0;
      }
    }, 50);
  }

  fire() {
    if (this.charging) {
      clearInterval(this.chargeInterval);
      console.log('Firing projectile with angle:', this.angle, 'power:', this.power);
      this.gameService.fireProjectile(this.angle, this.power);
      this.charging = false;
      this.power = 0;
    }
  }

  cancelCharging() {
    if (this.charging) {
      clearInterval(this.chargeInterval);
      this.charging = false;
      this.power = 0;
      console.log('Cancelled charging');
    }
  }

  applyGameMode() {
    console.log('Applying game mode:', this.selectedMode);
    this.gameService.applyGameMode(this.selectedMode);
  }

  updateWeather() {
    console.log('Updating weather:', this.selectedWeather, 'intensity:', this.weatherIntensity);
    this.gameService.updateWeather({
      type: this.selectedWeather,
      intensity: this.weatherIntensity
    });
  }

  resetSettings() {
    console.log('Resetting game settings');
    this.gameService.resetSettings();
  }
} 