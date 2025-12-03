import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatchmakingService } from '../../services/matchmaking.service';
import { QueueStatus } from '../../types/matchmaking.types';

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './matchmaking.component.html',
  styleUrl: './matchmaking.component.css'
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  queueStatus: QueueStatus | null = null;
  isInQueue = false;
  isLoading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly matchmakingService: MatchmakingService) {}

  ngOnInit(): void {
    // Connect to socket and check if player is already in queue (for page refresh)
    this.checkExistingQueueStatus();
  }

  // Check if player is already in queue (for page refresh/reconnection)
  private checkExistingQueueStatus(): void {
    // Connect to socket first - this creates the socket
    this.matchmakingService
      .connect()
      .then(() => {
        // After socket is connected, set up subscriptions
        // Backend sends queue-status automatically on reconnect if player is in queue

        // Subscribe to queue-status updates (backend will send if player is already in queue)
        this.matchmakingService
          .onQueueStatus()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (status: QueueStatus) => {
              // Player is already in queue - restore UI
              this.queueStatus = status;
              this.isInQueue = status.position >= 0;
              this.isLoading = false;
              this.error = null;
            }
          });

        // Set up error handling
        this.matchmakingService
          .onError()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: error => {
              this.error = error.message || 'An error occurred';
              this.isLoading = false;
            }
          });

        this.isLoading = false;
      })
      .catch(error => {
        // Connection failed - that's ok, user can still join queue later
        // eslint-disable-next-line no-console
        console.log('Could not connect to matchmaking service:', error.message);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Optionally disconnect when leaving the component
    // this.matchmakingService.disconnect();
  }

  joinQueue(): void {
    if (this.isInQueue || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Join queue first - this will establish the socket connection
    this.matchmakingService
      .joinQueue()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status: QueueStatus) => {
          this.queueStatus = status;
          this.isInQueue = status.position >= 0;
          this.isLoading = false;
          this.error = null;

          // After successfully joining, subscribe to real-time updates
          this.setupQueueStatusSubscriptions();
        },
        error: (err: Error) => {
          this.error = err.message || 'Failed to join queue';
          this.isLoading = false;
          this.isInQueue = false;
          this.queueStatus = null;
        }
      });
  }

  // Set up subscriptions for real-time queue status updates
  private setupQueueStatusSubscriptions(): void {
    // Subscribe to real-time queue status updates
    this.matchmakingService
      .onQueueStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status: QueueStatus) => {
          this.queueStatus = status;
          this.isInQueue = status.position >= 0;
        },
        error: (err: Error) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });

    // Subscribe to error events
    this.matchmakingService
      .onError()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: error => {
          this.error = error.message || 'An error occurred';
          this.isLoading = false;
        }
      });
  }

  leaveQueue(): void {
    if (!this.isInQueue || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.matchmakingService
      .leaveQueue()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.queueStatus = null;
          this.isInQueue = false;
          this.isLoading = false;
          this.error = null;
        },
        error: (err: Error) => {
          this.error = err.message || 'Failed to leave queue';
          this.isLoading = false;
        }
      });
  }

  formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
}
