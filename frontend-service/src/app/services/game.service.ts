import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { gameConfig } from '../config/game.config';
import {
  GameState,
  GameStartedEvent,
  GameStateUpdateEvent,
  GameErrorEvent
} from '../types/game.types';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket | null = null;
  private readonly gameStateSubject = new BehaviorSubject<GameState | null>(null);
  private readonly gameErrorSubject = new Subject<GameErrorEvent>();
  private readonly gameJoinedSubject = new BehaviorSubject<{
    matchId: string;
    message: string;
  } | null>(null);
  public readonly gameJoined$ = this.gameJoinedSubject.asObservable();
  private isConnected = false;
  private currentMatchId: string | null = null;

  constructor(private readonly authService: AuthService) {}

  /**
   * Connect to game engine via Socket.io
   * @param matchId - Match ID to connect to
   * @returns Observable that emits when connection is established
   */
  connectToGame(matchId: string): Observable<boolean> {
    return new Observable(observer => {
      const token = this.authService.getToken();
      if (!token) {
        observer.error(new Error('Not authenticated'));
        return () => {};
      }

      // Disconnect existing connection if any
      if (this.socket) {
        this.disconnect();
      }

      this.currentMatchId = matchId;

      try {
        // Get base URL (same origin for nginx routing)
        // IMPORTANT: Socket.io expects just the origin, NOT the full path
        // The path should be specified in the 'path' option, not in the URL
        const baseUrl = globalThis.window === undefined ? '' : globalThis.window.location.origin;

        // Initialize Socket.io connection
        // Match the pattern from matchmaking service exactly: io(origin, { path: '/ws/...' })
        // Note: matchmaking doesn't pass query or auth in initial connection - we'll send matchId after connect
        const socketPath = gameConfig.websocket.path;

        // Explicitly prevent query parameters - Socket.io should NOT send matchId in query
        // We'll send matchId via 'join-game' event after connection
        this.socket = io(baseUrl, {
          path: socketPath,
          transports: ['websocket', 'polling'],
          reconnection: gameConfig.websocket.reconnection.enabled,
          reconnectionDelay: gameConfig.websocket.reconnection.delayMs,
          reconnectionAttempts: gameConfig.websocket.reconnection.attempts,
          reconnectionDelayMax: gameConfig.websocket.reconnection.delayMaxMs,
          timeout: gameConfig.websocket.connectionTimeoutMs,
          autoConnect: true,
          // Force new connection when socket was reset
          forceNew: true,
          // Explicitly set query and auth to empty to prevent any query parameters
          query: {},
          auth: {}
          // Note: We'll send matchId via 'join-game' event after connection, like matchmaking does
        });

        // Connection timeout
        let connectTimeout: ReturnType<typeof setTimeout> | null = null;
        let hasCompleted = false;

        const cleanup = () => {
          if (connectTimeout) {
            clearTimeout(connectTimeout);
            connectTimeout = null;
          }
          // Only remove connection-related listeners, NOT game event listeners
          // Game event listeners should remain active throughout the game session
          if (this.socket) {
            this.socket.off('connect', onConnect);
            this.socket.off('connect_error', onConnectError);
            // Don't remove game-joined here - it might be needed after connection
          }
        };

        const cleanupAll = () => {
          cleanup();
          // Only cleanup all listeners when disconnecting completely
          if (this.socket) {
            this.socket.off('game-joined', onGameJoined);
            this.socket.off('game-started', onGameStarted);
            this.socket.off('game-state-update', onGameStateUpdate);
            this.socket.off('game-error', onGameError);
            this.socket.off('disconnect', onDisconnect);
          }
        };

        const onConnect = () => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          this.isConnected = true;

          // Send join-game event with matchId, token, userId, and heroId
          // This allows backend to initialize game state with correct player info
          if (this.socket && matchId) {
            const userId = this.authService.getUserIdFromToken();
            // TODO: Get heroId from match data or user profile
            // For now, use default heroId - this should come from matchmaking match data
            // When hero selection is implemented, this should be retrieved from:
            // 1. Match data passed from matchmaking component
            // 2. User profile/preferences
            // 3. Matchmaking service match details
            const heroId = 'default-hero';

            this.socket.emit('join-game', {
              matchId,
              token,
              userId,
              heroId
            });
          }

          observer.next(true);
          observer.complete();
        };

        const onConnectError = (error: Error) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          this.isConnected = false;
          observer.error(error);
        };

        // Set connection timeout
        connectTimeout = setTimeout(() => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          this.isConnected = false;
          observer.error(new Error('Connection timeout'));
        }, gameConfig.websocket.connectionTimeoutMs);

        // Game event handlers
        const onGameJoined = (data: { matchId: string; message: string }) => {
          // Emit to subscribers so components can show "Waiting for opponent..." message
          this.gameJoinedSubject.next(data);
        };

        const onGameStarted = (event: GameStartedEvent) => {
          if (event.gameState) {
            this.gameStateSubject.next(event.gameState);
          }
        };

        const onGameStateUpdate = (event: GameStateUpdateEvent) => {
          if (event.gameState) {
            this.gameStateSubject.next(event.gameState);
          }
        };

        const onGameError = (event: GameErrorEvent) => {
          this.gameErrorSubject.next(event);
        };

        const onDisconnect = (reason: string) => {
          this.isConnected = false;
          if (reason === 'io server disconnect') {
            // Server disconnected, reconnect manually if needed
            this.socket?.connect();
          }
        };

        // Register event listeners
        this.socket.on('connect', onConnect);
        this.socket.on('connect_error', onConnectError);
        this.socket.on('game-joined', onGameJoined);

        // Add explicit logging for game-started listener
        this.socket.on('game-started', (event: GameStartedEvent) => {
          onGameStarted(event);
        });

        this.socket.on('game-state-update', onGameStateUpdate);
        this.socket.on('game-error', onGameError);
        this.socket.on('disconnect', onDisconnect);

        // Return cleanup function
        return () => {
          cleanupAll();
        };
      } catch (error) {
        observer.error(error);
        return () => {};
      }
    });
  }

  /**
   * Get game state Observable
   * @returns Observable that emits game state updates
   */
  getGameState(): Observable<GameState | null> {
    return this.gameStateSubject.asObservable();
  }

  /**
   * Get game error Observable
   * @returns Observable that emits game errors
   */
  getGameErrors(): Observable<GameErrorEvent> {
    return this.gameErrorSubject.asObservable();
  }

  /**
   * Get current game state (synchronous)
   * @returns Current game state or null
   */
  getCurrentGameState(): GameState | null {
    return this.gameStateSubject.value;
  }

  /**
   * Check if connected to game
   * @returns true if connected
   */
  isGameConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Disconnect from game
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentMatchId = null;
    this.gameStateSubject.next(null);
    this.gameJoinedSubject.next(null); // Reset game-joined state
  }

  /**
   * Reset connection (cleanup and clear state)
   */
  resetConnection(): void {
    this.disconnect();
  }
}
