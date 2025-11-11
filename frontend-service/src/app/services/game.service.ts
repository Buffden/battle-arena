import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GameState {
  players: Array<{
    id: string;
    username: string;
    position: { x: number; y: number };
    health: number;
    score: number;
  }>;
  projectiles: Array<{
    id: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    ownerId: string;
  }>;
  settings: {
    gameMode: string;
    maxPlayers: number;
    timeLimit: number;
    physics: {
      gravity: number;
      friction: number;
      airResistance: number;
    };
    weather: {
      type: string;
      intensity: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket | null = null;
  private gameStateSubject = new BehaviorSubject<GameState | null>(null);
  private errorSubject = new Subject<string>();
  private isConnected = false;

  constructor() {
    // Do not initialize socket here
  }

  private initializeSocket(onConnectCallback?: () => void) {
    console.log('Initializing game socket...');
    const token = localStorage.getItem('token');
    console.log('Game socket token:', token);
    if (!token) {
      this.errorSubject.next('No authentication token found');
      return;
    }

    this.socket = io('http://localhost:5002', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    

    this.setupSocketListeners();

    if (onConnectCallback) {
      this.socket.on('connect', onConnectCallback);
    }

    this.socket.on('connect', () => {
      console.log('✅ Connected to Game Engine Socket');
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Game Engine socket connect error:', err.message);
    });
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to Game Engine Socket');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Game socket disconnected');
      this.isConnected = false;
      this.gameStateSubject.next(null);
    });

    this.socket.on('gameState', (state: GameState) => {
      console.log('Received game state:', state);
      this.gameStateSubject.next(state);
    });

    this.socket.on('error', (error: string) => {
      console.error('Game socket error:', error);
      this.errorSubject.next(error);
    });

    // Game settings events
    this.socket.on('settings:updated', (settings: any) => {
      console.log('Game settings updated:', settings);
      const currentState = this.gameStateSubject.value;
      if (currentState) {
        this.gameStateSubject.next({
          ...currentState,
          settings
        });
      }
    });

    // Weather events
    this.socket.on('weather:updated', (weather: any) => {
      console.log('Weather updated:', weather);
      const currentState = this.gameStateSubject.value;
      if (currentState) {
        this.gameStateSubject.next({
          ...currentState,
          settings: {
            ...currentState.settings,
            weather
          }
        });
      }
    });
  }

  // Game actions
  fireProjectile(angle: number, power: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('game:fire', { angle, power });
    }
  }

  movePlayer(direction: { x: number; y: number }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('game:move', direction);
    }
  }

  // Settings management
  updateSettings(settings: Partial<GameState['settings']>): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('settings:update', settings);
    }
  }

  updateWeather(weather: GameState['settings']['weather']): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('settings:updateWeather', weather);
    }
  }

  applyGameMode(mode: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('settings:applyMode', { mode });
    }
  }

  resetSettings(): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('settings:reset');
    }
  }

  // Observables
  getGameState(): Observable<GameState | null> {
    return this.gameStateSubject.asObservable();
  }

  getErrors(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Add public methods for room management
  joinRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      const token = localStorage.getItem('token');
      console.log('Joining game room:', roomId, 'with token:', token);
      this.socket.emit('join_room', { roomId, token });
    } else {
      // Initialize socket and join room after connection
      this.initializeSocket(() => {
        const token = localStorage.getItem('token');
        console.log('Joining game room (after connect):', roomId, 'with token:', token);
        this.socket?.emit('join_room', { roomId, token });
      });
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }
} 