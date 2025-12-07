import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

interface QueueState {
  isInQueue: boolean;
  timestamp?: number;
}

interface QueueResponse {
  success: boolean;
  position?: number;
  estimatedWaitTime?: number;
  message?: string;
}

interface MatchFound {
  matchId: string;
  gameRoomId: string;
  opponent: {
    userId: string;
    heroId: string;
  };
  timestamp: number;
  timeout: number; // Timeout in milliseconds
}

interface MatchAcceptanceUpdate {
  matchId: string;
  player1Id: string;
  player2Id: string;
  player1Accepted: boolean;
  player2Accepted: boolean;
  player1Rejected: boolean;
  player2Rejected: boolean;
  bothAccepted: boolean;
}

interface MatchRejected {
  matchId: string;
  rejectedBy: string;
  player1Id: string;
  player2Id: string;
  player1Rejected: boolean;
  player2Rejected: boolean;
}

interface MatchConfirmed {
  matchId: string;
  gameRoomId: string;
  player1Id: string;
  player2Id: string;
  opponentId: string;
  yourId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private readonly QUEUE_STATE_KEY = 'battle_arena_queue_state';
  private readonly WS_URL = '/ws/matchmaking';

  private socket: Socket | null = null;
  private readonly queueStatusSubject = new BehaviorSubject<{
    position: number;
    estimatedWaitTime: number;
  } | null>(null);
  private readonly matchFoundSubject = new Subject<MatchFound>();
  private readonly matchAcceptanceUpdateSubject = new Subject<MatchAcceptanceUpdate>();
  private readonly matchRejectedSubject = new Subject<MatchRejected>();
  private readonly matchConfirmedSubject = new Subject<MatchConfirmed>();
  private readonly matchAcceptanceExpiredSubject = new Subject<{
    matchId: string;
    message?: string;
    timeoutCount?: number;
  }>();
  private readonly queueTimeoutSubject = new Subject<{ message?: string; reason?: string }>();
  private readonly queueDisconnectedSubject = new Subject<{
    message?: string;
    reason?: string;
    timeoutCount?: number;
  }>();
  private isConnected = false;

  constructor(private readonly authService: AuthService) {}

  /**
   * Join the matchmaking queue
   */
  joinQueue(): Observable<QueueResponse> {
    return new Observable(observer => {
      const token = this.authService.getToken();
      if (!token) {
        observer.error(new Error('Not authenticated'));
        return () => {}; // Return empty cleanup function
      }

      try {
        this.connectWebSocket();

        if (!this.socket) {
          observer.error(new Error('Failed to create socket connection'));
          return () => {};
        }

        // Wait for connection with proper timeout handling
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
          }
        };

        const cleanupAll = () => {
          cleanup();
          if (this.socket) {
            this.socket.off('queue-status', onQueueStatus);
            this.socket.off('queue-error', onQueueError);
            this.socket.off('match-found', onMatchFound);
          }
        };

        connectTimeout = setTimeout(() => {
          if (!this.isConnected && !hasCompleted) {
            hasCompleted = true;
            cleanupAll();
            observer.error(new Error('Connection timeout - please try again'));
          }
        }, 10000); // Increased to 10 seconds for retry scenarios

        const onConnect = () => {
          if (hasCompleted) return;
          // Don't set hasCompleted here - wait for queue-status response
          // Only cleanup the connection-related listeners
          this.isConnected = true;

          // Extract userId from token
          const userId = this.authService.getUserIdFromToken(token);

          // Send join queue message
          if (this.socket) {
            this.socket.emit('join-queue', {
              token: token,
              userId: userId,
              // Note: heroIds will be populated when hero selection feature is implemented
              heroIds: []
            });
          }
        };

        const onConnectError = (error: Error) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanupAll();
          observer.error(new Error(`Connection failed: ${error.message}`));
        };

        const onQueueStatus = (data: { position: number; estimatedWaitTime: number }) => {
          if (hasCompleted) return;
          hasCompleted = true;
          const response: QueueResponse = {
            success: true,
            position: data.position,
            estimatedWaitTime: data.estimatedWaitTime
          };
          // Update queueStatusSubject for immediate UI update
          this.queueStatusSubject.next({
            position: data.position,
            estimatedWaitTime: data.estimatedWaitTime
          });
          // Emit to observer for initial response, then complete
          // Persistent listener will handle subsequent queueStatusSubject updates
          observer.next(response);
          observer.complete();
          // Remove this temporary listener after initial response
          if (this.socket) {
            this.socket.off('queue-status', onQueueStatus);
          }
        };

        const onQueueError = (data: { message?: string }) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanupAll();
          observer.error(new Error(data.message || 'Failed to join queue'));
        };

        const onMatchFound = (data: MatchFound) => {
          // eslint-disable-next-line no-console
          console.log('🎮 MATCH FOUND! Received match-found event:', data);
          this.matchFoundSubject.next(data);
        };

        // Set up event listeners
        if (this.socket) {
          this.socket.on('connect', onConnect);
          this.socket.on('connect_error', onConnectError);
          this.socket.on('queue-status', onQueueStatus);
          this.socket.on('queue-error', onQueueError);
          this.socket.on('match-found', onMatchFound);
        }

        // If socket is already connected, trigger onConnect immediately
        if (this.socket?.connected) {
          onConnect();
        }

        // Cleanup
        return () => {
          cleanupAll();
        };
      } catch (error) {
        observer.error(error);
        return () => {}; // Return empty cleanup function on error
      }
    });
  }

  /**
   * Leave the matchmaking queue
   */
  leaveQueue(): Observable<void> {
    return new Observable(observer => {
      if (this.socket && this.isConnected) {
        this.socket.emit('leave-queue');
      }

      this.disconnectWebSocket();
      this.queueStatusSubject.next(null);
      observer.next();
      observer.complete();
    });
  }

  /**
   * Reconnect to queue after page refresh
   */
  reconnectToQueue(): Observable<QueueResponse> {
    return new Observable(observer => {
      const token = this.authService.getToken();
      if (!token) {
        observer.next({ success: false, message: 'Not authenticated' });
        observer.complete();
        return () => {};
      }

      try {
        this.connectWebSocket();

        if (!this.socket) {
          observer.next({ success: false, message: 'Failed to create socket connection' });
          observer.complete();
          return () => {};
        }

        const connectTimeout = setTimeout(() => {
          if (!this.isConnected) {
            observer.next({ success: false, message: 'Connection timeout' });
            observer.complete();
          }
        }, 5000);

        const onConnect = () => {
          clearTimeout(connectTimeout);
          this.isConnected = true;

          // Extract userId from token for reconnection
          const userId = this.authService.getUserIdFromToken(token);

          // Send reconnect message
          if (this.socket) {
            this.socket.emit('reconnect-queue', {
              token: token,
              userId: userId
            });
          }
        };

        const onQueueStatus = (data: { position: number; estimatedWaitTime: number }) => {
          const response: QueueResponse = {
            success: true,
            position: data.position,
            estimatedWaitTime: data.estimatedWaitTime
          };
          // Update queueStatusSubject for immediate UI update
          this.queueStatusSubject.next({
            position: data.position,
            estimatedWaitTime: data.estimatedWaitTime
          });
          // Emit to observer for initial response, then complete
          // Persistent listener will handle subsequent queueStatusSubject updates
          observer.next(response);
          observer.complete();
        };

        const onQueueError = (data: { message?: string }) => {
          observer.next({ success: false, message: data.message || 'Reconnection failed' });
          observer.complete();
        };

        const onConnectError = (error: Error) => {
          clearTimeout(connectTimeout);
          this.isConnected = false;
          observer.next({ success: false, message: `Connection error: ${error.message}` });
          observer.complete();
        };

        // Set up event listeners
        this.socket.on('connect', onConnect);
        this.socket.on('queue-status', onQueueStatus);
        this.socket.on('queue-error', onQueueError);
        this.socket.on('connect_error', onConnectError);

        // Cleanup
        return () => {
          clearTimeout(connectTimeout);
          if (this.socket) {
            this.socket.off('connect', onConnect);
            this.socket.off('queue-status', onQueueStatus);
            this.socket.off('queue-error', onQueueError);
            this.socket.off('connect_error', onConnectError);
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reconnect';
        observer.next({ success: false, message: errorMessage });
        observer.complete();
        return () => {}; // Return empty cleanup function on error
      }
    });
  }

  /**
   * Get queue status updates (includes null for cleared states)
   */
  getQueueStatus$(): Observable<{ position: number; estimatedWaitTime: number } | null> {
    return this.queueStatusSubject.asObservable();
  }

  /**
   * Get match found events
   */
  getMatchFound$(): Observable<MatchFound> {
    return this.matchFoundSubject.asObservable();
  }

  /**
   * Get match acceptance update events
   */
  getMatchAcceptanceUpdate$(): Observable<MatchAcceptanceUpdate> {
    return this.matchAcceptanceUpdateSubject.asObservable();
  }

  /**
   * Get match rejected events
   */
  getMatchRejected$(): Observable<MatchRejected> {
    return this.matchRejectedSubject.asObservable();
  }

  /**
   * Get match confirmed events (both players accepted)
   */
  getMatchConfirmed$(): Observable<MatchConfirmed> {
    return this.matchConfirmedSubject.asObservable();
  }

  /**
   * Get queue timeout events
   */
  getQueueTimeout$(): Observable<{ message?: string; reason?: string }> {
    return this.queueTimeoutSubject.asObservable();
  }

  /**
   * Get match acceptance expired events (when timer runs out)
   */
  getMatchAcceptanceExpired$(): Observable<{
    matchId: string;
    message?: string;
    timeoutCount?: number;
  }> {
    return this.matchAcceptanceExpiredSubject.asObservable();
  }

  /**
   * Get observable for queue disconnection events (when player is removed due to multiple timeouts)
   */
  getQueueDisconnected$(): Observable<{
    message?: string;
    reason?: string;
    timeoutCount?: number;
  }> {
    return this.queueDisconnectedSubject.asObservable();
  }

  /**
   * Check if socket is connected
   */
  isSocketConnected(): boolean {
    return this.socket !== null && this.isConnected && this.socket.connected === true;
  }

  /**
   * Accept a match
   */
  acceptMatch(matchId: string): boolean {
    if (!this.isSocketConnected()) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Cannot accept match: socket not connected');
      return false;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      // eslint-disable-next-line no-console
      console.error('❌ Cannot accept match: userId not found');
      return false;
    }

    // Log without exposing IDs for security
    // eslint-disable-next-line no-console
    console.log('📤 Accepting match');
    this.socket!.emit('accept-match', {
      matchId,
      userId
    });
    return true;
  }

  /**
   * Reject a match
   */
  rejectMatch(matchId: string): boolean {
    if (!this.isSocketConnected()) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Cannot reject match: socket not connected');
      return false;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      // eslint-disable-next-line no-console
      console.error('❌ Cannot reject match: userId not found');
      return false;
    }

    // Log without exposing IDs for security
    // eslint-disable-next-line no-console
    console.log('📤 Rejecting match');
    this.socket!.emit('reject-match', {
      matchId,
      userId
    });
    return true;
  }

  /**
   * Save queue state to localStorage
   */
  saveQueueState(state: QueueState): void {
    if (globalThis.window !== undefined) {
      const stateWithTimestamp = {
        ...state,
        timestamp: Date.now()
      };
      globalThis.window.localStorage.setItem(
        this.QUEUE_STATE_KEY,
        JSON.stringify(stateWithTimestamp)
      );
    }
  }

  /**
   * Get saved queue state from localStorage
   */
  getSavedQueueState(): QueueState | null {
    if (globalThis.window !== undefined) {
      const saved = globalThis.window.localStorage.getItem(this.QUEUE_STATE_KEY);
      if (saved) {
        try {
          const state = JSON.parse(saved) as QueueState & { timestamp?: number };
          // Check if state is not too old (e.g., 1 hour)
          if (state.timestamp && Date.now() - state.timestamp < 3600000) {
            return state;
          }
        } catch (error) {
          console.error('Error parsing saved queue state:', error);
        }
      }
    }
    return null;
  }

  /**
   * Clear saved queue state
   */
  clearSavedQueueState(): void {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.removeItem(this.QUEUE_STATE_KEY);
    }
  }

  /**
   * Connect to WebSocket using Socket.io
   * Industrial best practice: Singleton pattern - reuse existing socket instance
   * Socket.io handles reconnection automatically, so we don't create new instances
   */
  private connectWebSocket(): void {
    // If socket exists and is connected, reuse it
    if (this.socket?.connected) {
      return;
    }

    // If socket exists but disconnected, try to reconnect it
    if (this.socket && !this.socket.connected) {
      // Remove old event listeners to prevent duplicates
      this.socket.removeAllListeners();
      // Socket.io will automatically reconnect due to reconnection: true
      this.setupSocketEventListeners();
      if (this.socket && !this.socket.active) {
        this.socket.connect();
      }
      return;
    }

    // Create new socket instance only if it doesn't exist or was explicitly reset
    // Socket.io client connects to the origin and uses the path option
    // The path should match what's configured on the server
    this.socket = io(globalThis.window.location.origin, {
      path: this.WS_URL,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      // Force new connection when socket was reset
      forceNew: true // Force new connection to ensure clean state
    });

    this.isConnected = false;
    this.setupSocketEventListeners();
  }

  /**
   * Setup Socket.io event listeners
   * Separated to avoid duplicate listeners when reusing socket
   */
  private setupSocketEventListeners(): void {
    if (!this.socket) {
      return;
    }

    // Remove all existing listeners to prevent duplicates
    this.socket.removeAllListeners();

    this.socket.on('connect', () => {
      this.isConnected = true;
      // eslint-disable-next-line no-console
      console.log('Socket.io connected:', this.socket?.id);
    });

    this.socket.on('disconnect', reason => {
      this.isConnected = false;
      // eslint-disable-next-line no-console
      console.log('Socket.io disconnected:', reason);

      // If disconnect was due to server closing, don't try to reconnect
      if (reason === 'io server disconnect') {
        // Server closed the connection, need to manually reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', error => {
      this.isConnected = false;
      // eslint-disable-next-line no-console
      console.error('Socket.io connection error:', error);
    });

    this.socket.on('reconnect', attemptNumber => {
      this.isConnected = true;
      // eslint-disable-next-line no-console
      console.log('Socket.io reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', () => {
      // eslint-disable-next-line no-console
      // console.log('Socket.io reconnection attempt...');
    });

    this.socket.on('reconnect_error', error => {
      // eslint-disable-next-line no-console
      console.error('Socket.io reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      // eslint-disable-next-line no-console
      console.error('Socket.io reconnection failed after all attempts');
      this.isConnected = false;
    });

    // Persistent listener for queue-timeout (always listening while socket is connected)
    this.socket.on('queue-timeout', (data: { message?: string; reason?: string }) => {
      // Clear queue state on timeout
      this.queueStatusSubject.next(null);
      this.clearSavedQueueState();
      // Emit timeout event so component can react
      this.queueTimeoutSubject.next(data);
      // eslint-disable-next-line no-console
      console.log('Queue timeout received:', data.message);
    });

    // Persistent listener for queue-disconnected (when player is removed due to multiple timeouts)
    this.socket.on(
      'queue-disconnected',
      (data: { message?: string; reason?: string; timeoutCount?: number }) => {
        // Clear queue state on disconnection
        this.queueStatusSubject.next(null);
        this.clearSavedQueueState();
        // Disconnect socket
        this.disconnectWebSocket();
        // Emit disconnection event so component can react
        this.queueDisconnectedSubject.next(data);
        // eslint-disable-next-line no-console
        console.log('Queue disconnected due to multiple timeouts:', data);
      }
    );

    // Persistent listener for queue-status updates (always listening while socket is connected)
    this.socket.on('queue-status', (data: { position: number; estimatedWaitTime: number }) => {
      // Only log if position changed significantly or it's a new status
      // eslint-disable-next-line no-console
      // console.log('Received queue-status update:', data);
      this.queueStatusSubject.next({
        position: data.position,
        estimatedWaitTime: data.estimatedWaitTime
      });
    });

    // Persistent listener for match-found (always listening while socket is connected)
    this.socket.on('match-found', (data: MatchFound) => {
      // Log without exposing match ID for security
      // eslint-disable-next-line no-console
      console.log('🎮 MATCH FOUND!');
      this.matchFoundSubject.next(data);
    });

    // Persistent listener for match-acceptance-update
    this.socket.on('match-acceptance-update', (data: MatchAcceptanceUpdate) => {
      // eslint-disable-next-line no-console
      // console.log('📊 Match acceptance update:', data);
      this.matchAcceptanceUpdateSubject.next(data);
    });

    // Persistent listener for match-rejected
    this.socket.on('match-rejected', (data: MatchRejected) => {
      // Log without exposing match ID for security
      // eslint-disable-next-line no-console
      console.log('❌ Match rejected');
      this.matchRejectedSubject.next(data);
    });

    // Persistent listener for match-confirmed
    this.socket.on('match-confirmed', (data: MatchConfirmed) => {
      // eslint-disable-next-line no-console
      console.log('✅ Match confirmed:', data);
      this.matchConfirmedSubject.next(data);
    });

    // Persistent listener for match-acceptance-expired (when timer runs out)
    this.socket.on(
      'match-acceptance-expired',
      (data: { matchId: string; message?: string; timeoutCount?: number }) => {
        // eslint-disable-next-line no-console
        console.log('⏱️ Match acceptance expired:', data);
        this.matchAcceptanceExpiredSubject.next(data);
      }
    );
  }

  /**
   * Disconnect from WebSocket
   */
  private disconnectWebSocket(): void {
    if (this.socket) {
      // Remove all listeners first
      this.socket.removeAllListeners();
      // Disconnect the socket
      this.socket.disconnect();
      // Destroy the socket instance to ensure clean state
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Reset connection state (public method for component use)
   * Useful when retrying after errors
   */
  resetConnection(): void {
    this.disconnectWebSocket();
    this.queueStatusSubject.next(null);
    this.clearSavedQueueState();
    // Ensure socket is completely nulled out for fresh connection
    this.socket = null;
    this.isConnected = false;
  }
}
