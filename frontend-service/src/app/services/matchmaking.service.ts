import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, fromEvent, EMPTY } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { QueueStatus, MatchmakingEvent, MatchmakingError } from '../types/matchmaking.types';

// MatchmakingService
// Handles Socket.io connection and matchmaking queue operations
@Injectable({
  providedIn: 'root'
})
export class MatchmakingService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly matchmakingUrl: string;
  private readonly connectionStatus$ = new BehaviorSubject<boolean>(false);
  public readonly isConnected$ = this.connectionStatus$.asObservable();

  constructor(private readonly authService: AuthService) {
    // In development, connect directly to matchmaking service
    // In production, this would go through nginx gateway at /ws/matchmaking
    this.matchmakingUrl = this.getMatchmakingUrl();
  }

  // Get matchmaking service URL based on environment
  // Always connect through nginx gateway at /ws/matchmaking
  private getMatchmakingUrl(): string {
    // Check if running in browser
    if (globalThis.window === undefined) {
      return 'http://localhost/ws/matchmaking'; // Default for SSR (through nginx)
    }

    // Connect through nginx gateway at same origin
    // Socket.io will handle the path automatically
    const protocol = globalThis.window.location.protocol;
    const host = globalThis.window.location.host;

    // Use http/https, Socket.io will upgrade to ws/wss automatically
    return `${protocol}//${host}`;
  }

  // Establish Socket.io connection if not already connected
  // Public method for checking existing queue status on page load
  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    return new Promise((resolve, reject) => {
      // Disconnect existing socket if any
      if (this.socket) {
        this.socket.disconnect();
      }

      // Create new socket connection with authentication
      // Connect through nginx gateway at /ws/matchmaking
      // Socket.io path must match the nginx proxy path
      // eslint-disable-next-line no-console
      console.log('Attempting to connect to matchmaking service:', this.matchmakingUrl);
      this.socket = io(this.matchmakingUrl, {
        path: '/ws/matchmaking/socket.io',
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // Handle connection events
      this.socket.on('connect', () => {
        this.connectionStatus$.next(true);
        resolve();
      });

      this.socket.on('connect_error', error => {
        this.connectionStatus$.next(false);
        // eslint-disable-next-line no-console
        console.error('Socket.io connection error:', error);
        // eslint-disable-next-line no-console
        console.error('Connection details:', {
          url: this.matchmakingUrl,
          errorMessage: error.message || String(error)
        });
        const errorMessage = error.message || String(error) || 'WebSocket error';
        reject(new Error(`Connection failed: ${errorMessage}`));
      });

      this.socket.on('disconnect', () => {
        this.connectionStatus$.next(false);
      });

      // Set connection timeout
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  // Disconnect Socket.io connection
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus$.next(false);
    }
  }

  // Join matchmaking queue
  joinQueue(): Observable<QueueStatus> {
    return new Observable(observer => {
      this.connect()
        .then(() => {
          if (!this.socket) {
            observer.error(new Error('Socket not available'));
            return;
          }

          // Listen for queue-status event (response)
          const statusSubscription = fromEvent<QueueStatus>(
            this.socket,
            MatchmakingEvent.QUEUE_STATUS
          )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: status => {
                observer.next(status);
                statusSubscription.unsubscribe();
              },
              error: err => {
                observer.error(err);
                statusSubscription.unsubscribe();
              }
            });

          // Listen for error events
          const errorSubscription = fromEvent<MatchmakingError>(this.socket, MatchmakingEvent.ERROR)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: error => {
                observer.error(new Error(error.message || 'Failed to join queue'));
                statusSubscription.unsubscribe();
                errorSubscription.unsubscribe();
              }
            });

          // Emit join-queue event
          this.socket.emit(MatchmakingEvent.JOIN_QUEUE);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Leave matchmaking queue
  leaveQueue(): Observable<void> {
    return new Observable(observer => {
      if (!this.socket?.connected) {
        observer.error(new Error('Not connected to matchmaking service'));
        return;
      }

      // Listen for queue-left confirmation event
      const leftSubscription = fromEvent<{ success: boolean; message?: string }>(
        this.socket,
        MatchmakingEvent.QUEUE_LEFT
      )
        .pipe(
          filter(response => response.success),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: () => {
            observer.next();
            observer.complete();
            leftSubscription.unsubscribe();
          },
          error: err => {
            observer.error(err);
            leftSubscription.unsubscribe();
          }
        });

      // Listen for error events
      const errorSubscription = fromEvent<MatchmakingError>(this.socket, MatchmakingEvent.ERROR)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: error => {
            observer.error(new Error(error.message || 'Failed to leave queue'));
            leftSubscription.unsubscribe();
            errorSubscription.unsubscribe();
          }
        });

      // Emit leave-queue event
      this.socket.emit(MatchmakingEvent.LEAVE_QUEUE);

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!leftSubscription.closed) {
          observer.error(new Error('Leave queue timeout'));
          leftSubscription.unsubscribe();
          errorSubscription.unsubscribe();
        }
      }, 5000);
    });
  }

  // Subscribe to real-time queue status updates
  onQueueStatus(): Observable<QueueStatus> {
    if (!this.socket) {
      // Return empty observable if socket not available yet
      // Component will subscribe after socket is connected
      return EMPTY;
    }

    return fromEvent<QueueStatus>(this.socket, MatchmakingEvent.QUEUE_STATUS).pipe(
      takeUntil(this.destroy$),
      map(status => status)
    );
  }

  // Subscribe to connection errors
  onError(): Observable<MatchmakingError> {
    if (!this.socket) {
      // Return empty observable if socket not available yet
      // Component will subscribe after socket is connected
      return EMPTY;
    }

    return fromEvent<MatchmakingError>(this.socket, MatchmakingEvent.ERROR).pipe(
      takeUntil(this.destroy$)
    );
  }

  // Check if currently connected to matchmaking service
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Cleanup on service destruction
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
