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

        // Debug logging
        console.log('=== GameService: Connecting to game engine ===');
        console.log('Base URL (origin):', baseUrl);
        console.log('WebSocket path:', gameConfig.websocket.path);
        console.log('Match ID:', matchId);
        console.log('Has token:', !!token);

        // Initialize Socket.io connection
        // Match the pattern from matchmaking service exactly: io(origin, { path: '/ws/...' })
        // Note: matchmaking doesn't pass query or auth in initial connection - we'll send matchId after connect
        const socketPath = gameConfig.websocket.path;
        const socketNamespace = '/'; // Default namespace

        console.log('=== GameService: Socket.io Connection Details ===');
        console.log('Base URL (origin):', baseUrl);
        console.log('Socket Path:', socketPath);
        console.log('Socket Namespace (default):', socketNamespace);
        console.log('Full URL would be:', `${baseUrl}${socketPath}`);
        console.log('Match ID:', matchId);
        console.log('Has token:', !!token);

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

        console.log('=== GameService: Socket.io instance created ===');
        console.log('Socket ID (before connect):', this.socket.id);
        console.log('Socket connected (before connect):', this.socket.connected);
        // Access namespace through io property
        const socketNamespaceName = (this.socket as any).nsp?.name || 'default';
        console.log('Socket namespace:', socketNamespaceName);
        console.log('Socket.io URI:', (this.socket as any).io?.uri);

        // Connection timeout
        let connectTimeout: ReturnType<typeof setTimeout> | null = null;
        let hasCompleted = false;

        const cleanup = () => {
          if (connectTimeout) {
            clearTimeout(connectTimeout);
            connectTimeout = null;
          }
          if (this.socket) {
            this.socket.off('connect', onConnect);
            this.socket.off('connect_error', onConnectError);
            this.socket.off('game-joined', onGameJoined);
          }
        };

        const cleanupAll = () => {
          cleanup();
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
          console.log('=== GameService: Connected successfully ===');
          console.log('Socket ID:', this.socket?.id);
          console.log('Socket connected:', this.socket?.connected);
          if (this.socket) {
            const socketNamespaceName = (this.socket as any).nsp?.name || 'default';
            console.log('Socket namespace:', socketNamespaceName);
            console.log(
              'Socket path:',
              socketNamespaceName === '/' ? 'default' : socketNamespaceName
            );
            console.log('Socket transport:', (this.socket as any).io?.engine?.transport?.name);
            console.log('Socket.io URI:', (this.socket as any).io?.uri);
          }

          // Send join-game event with matchId and token (similar to matchmaking's join-queue)
          if (this.socket && matchId) {
            this.socket.emit('join-game', {
              matchId,
              token
            });
            console.log('Sent join-game event for match:', matchId);
          }

          observer.next(true);
          observer.complete();
        };

        const onConnectError = (error: Error) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          this.isConnected = false;
          console.error('=== GameService: Connection error ===');
          console.error('Error type:', error.constructor.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          if (this.socket) {
            const socketNamespaceName = (this.socket as any).nsp?.name || 'default';
            console.error('Socket namespace (on error):', socketNamespaceName);
            console.error(
              'Socket path (on error):',
              socketNamespaceName === '/' ? 'default' : socketNamespaceName
            );
            console.error('Socket connected (on error):', this.socket.connected);
            console.error('Socket ID (on error):', this.socket.id);
            console.error('Socket.io URI (on error):', (this.socket as any).io?.uri);
          }
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
          console.log('=== GameService: Successfully joined game ===');
          console.log('Game joined data:', data);
          // Connection is now fully established
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
          console.error('=== GameService: Game error ===');
          console.error('Error event:', event);
          this.gameErrorSubject.next(event);
        };

        const onDisconnect = (reason: string) => {
          this.isConnected = false;
          console.log('=== GameService: Disconnected ===');
          console.log('Reason:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, reconnect manually if needed
            this.socket?.connect();
          }
        };

        // Register event listeners
        this.socket.on('connect', onConnect);
        this.socket.on('connect_error', onConnectError);
        this.socket.on('game-joined', onGameJoined);
        this.socket.on('game-started', onGameStarted);
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
  }

  /**
   * Reset connection (cleanup and clear state)
   */
  resetConnection(): void {
    this.disconnect();
  }
}
