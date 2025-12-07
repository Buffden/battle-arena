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
  opponent: {
    id: string;
    username: string;
  };
  assignedHero?: string;
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
  private readonly queueTimeoutSubject = new Subject<{ message?: string; reason?: string }>();
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

        connectTimeout = setTimeout(() => {
          if (!this.isConnected && !hasCompleted) {
            hasCompleted = true;
            cleanup();
            observer.error(new Error('Connection timeout - please try again'));
          }
        }, 10000); // Increased to 10 seconds for retry scenarios

        const onConnect = () => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          this.isConnected = true;

          // Extract userId from token
          const userId = this.authService.getUserIdFromToken(token);

          // Send join queue message
          if (this.socket) {
            this.socket.emit('join-queue', {
              token: token,
              userId: userId,
              heroIds: [] // TODO: Get selected heroes from hero selection
            });
          }
        };

        const onConnectError = (error: Error) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          observer.error(new Error(`Connection failed: ${error.message}`));
        };

        const onQueueStatus = (data: { position: number; estimatedWaitTime: number }) => {
          const response: QueueResponse = {
            success: true,
            position: data.position,
            estimatedWaitTime: data.estimatedWaitTime
          };
          // Only emit to observer for initial response
          // Persistent listener will handle queueStatusSubject updates
          observer.next(response);
        };

        const onQueueError = (data: { message?: string }) => {
          if (hasCompleted) return;
          hasCompleted = true;
          cleanup();
          observer.error(new Error(data.message || 'Failed to join queue'));
        };

        const onMatchFound = (data: MatchFound) => {
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
        if (this.socket && this.socket.connected) {
          onConnect();
        }

        // Cleanup
        return () => {
          cleanup();
          if (this.socket) {
            this.socket.off('queue-status', onQueueStatus);
            this.socket.off('queue-error', onQueueError);
            this.socket.off('match-found', onMatchFound);
          }
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
          // Only emit to observer for initial response
          // Persistent listener will handle queueStatusSubject updates
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
        observer.next({ success: false, message: 'Failed to reconnect' });
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
   * Get queue timeout events
   */
  getQueueTimeout$(): Observable<{ message?: string; reason?: string }> {
    return this.queueTimeoutSubject.asObservable();
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
    if (this.socket && this.socket.connected) {
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
      console.log('Socket.io reconnection attempt...');
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

    // Persistent listener for queue-status updates (always listening while socket is connected)
    this.socket.on('queue-status', (data: { position: number; estimatedWaitTime: number }) => {
      this.queueStatusSubject.next({
        position: data.position,
        estimatedWaitTime: data.estimatedWaitTime
      });
    });
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
