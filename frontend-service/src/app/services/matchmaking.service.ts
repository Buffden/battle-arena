import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MatchFound {
  lobbyId: string;
  players: Array<{
    id: string;
    username: string;
    xp: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private socket: Socket | null = null;
  private matchFoundSubject = new Subject<MatchFound>();
  private queueStatusSubject = new Subject<boolean>();
  private isSocketReady = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Validate token format
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return;
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return;
    }

    this.socket = io('http://localhost:3002', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      if (error.message === 'Invalid authentication token') {
        // Token might be expired or invalid
        localStorage.removeItem('token');
        // You might want to redirect to login page here
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to matchmaking service');
      // Wait for 'ready' event before allowing queue join
      this.socket!.on('ready', () => {
        console.log('Socket is ready for matchmaking');
        this.isSocketReady = true;
        // Optionally, emit an event or call a callback to notify UI
      });
    });

    this.socket.on('queueJoined', () => {
      this.queueStatusSubject.next(true);
    });

    this.socket.on('queueLeft', () => {
      this.queueStatusSubject.next(false);
    });

    this.socket.on('matchFound', (matchData: MatchFound) => {
      this.matchFoundSubject.next(matchData);
    });

    this.socket.on('queueError', (error) => {
      console.error('Queue error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from matchmaking service');
      this.queueStatusSubject.next(false);
      this.isSocketReady = false;
    });
  }

  joinQueue(): void {
    if (!this.socket) {
      console.warn('Socket instance is null, re-initializing...');
      this.initializeSocket();
      // Wait for 'ready' event before emitting joinQueue
      return;
    }
    if (!this.isSocketReady) {
      console.warn('Socket not ready, cannot join queue yet');
      return;
    }
    console.log('Emitting joinQueue event');
      this.socket.emit('joinQueue');
  }

  leaveQueue(): void {
    if (this.socket) {
      this.socket.emit('leaveQueue');
    }
  }

  onMatchFound(): Observable<MatchFound> {
    return this.matchFoundSubject.asObservable();
  }

  onQueueStatusChange(): Observable<boolean> {
    return this.queueStatusSubject.asObservable();
  }

  isInQueue(): boolean {
    return this.socket?.connected || false;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
} 