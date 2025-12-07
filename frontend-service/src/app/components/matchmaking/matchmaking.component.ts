import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatchmakingService } from '../../services/matchmaking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matchmaking.component.html',
  styleUrl: './matchmaking.component.css'
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  isInQueue = false;
  queuePosition: number | null = null;
  estimatedWaitTime: number | null = null;
  isConnecting = false;
  errorMessage: string | null = null;
  private routerSubscription?: Subscription;

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    // Check if user was in queue before page refresh
    const savedQueueState = this.matchmakingService.getSavedQueueState();
    if (savedQueueState?.isInQueue) {
      // Restore queue connection
      this.restoreQueueConnection();
    }

    // Listen to router navigation events (including back button)
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        // Check if navigating away from matchmaking page
        const navigation = event as NavigationStart;
        if (navigation.url !== '/matchmaking' && this.isInQueue) {
          this.leaveQueue();
        }
      });
  }

  ngOnDestroy(): void {
    // Don't leave queue on component destroy - only on explicit actions
    // This allows queue to persist across page refreshes
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(_event: PopStateEvent): void {
    if (this.isInQueue) {
      this.leaveQueue();
    }
  }

  joinQueue(): void {
    if (this.isInQueue || this.isConnecting) {
      return;
    }

    // Reset state before joining
    this.errorMessage = null;
    this.isConnecting = true;

    this.matchmakingService.joinQueue().subscribe({
      next: response => {
        this.isConnecting = false;
        if (response.success) {
          this.isInQueue = true;
          this.queuePosition = response.position || null;
          this.estimatedWaitTime = response.estimatedWaitTime || null;
          this.matchmakingService.saveQueueState({ isInQueue: true });
        } else {
          // Handle timeout or other errors
          this.isInQueue = false;
          this.queuePosition = null;
          this.estimatedWaitTime = null;
          if (response.message?.includes('timed out') || response.message?.includes('timeout')) {
            this.errorMessage = 'Queue session timed out after 1 minute. Please try again.';
          } else {
            this.errorMessage = response.message || 'Failed to join queue. Please try again.';
          }
          this.matchmakingService.clearSavedQueueState();
        }
      },
      error: error => {
        this.isConnecting = false;
        this.isInQueue = false;
        this.errorMessage = error.message || 'Failed to join queue. Please try again.';
        this.matchmakingService.clearSavedQueueState();
        console.error('Error joining queue:', error);
      }
    });

    // Subscribe to queue status updates
    this.matchmakingService.getQueueStatus$().subscribe({
      next: status => {
        if (status) {
          this.queuePosition = status.position;
          this.estimatedWaitTime = status.estimatedWaitTime;
          this.isInQueue = true; // Ensure we're marked as in queue when status is received
          this.errorMessage = null; // Clear any previous errors
        } else {
          // Queue status cleared (e.g., timeout or leave)
          this.isInQueue = false;
          this.queuePosition = null;
          this.estimatedWaitTime = null;
        }
      },
      error: error => {
        console.error('Error receiving queue status:', error);
      }
    });

    // Subscribe to queue timeout events (direct listener for immediate UI update)
    this.matchmakingService.getQueueTimeout$().subscribe({
      next: data => {
        // Immediately update UI on timeout
        this.isInQueue = false;
        this.queuePosition = null;
        this.estimatedWaitTime = null;
        this.errorMessage =
          data.message || 'Queue session timed out after 1 minute. Please try again.';
      },
      error: error => {
        console.error('Error receiving queue timeout:', error);
      }
    });

    // Subscribe to match found events
    this.matchmakingService.getMatchFound$().subscribe({
      next: match => {
        // Navigate to game when match is found
        this.matchmakingService.clearSavedQueueState();
        this.router.navigate(['/game', match.matchId]);
      },
      error: error => {
        console.error('Error receiving match found:', error);
      }
    });
  }

  leaveQueue(): void {
    if (!this.isInQueue) {
      return;
    }

    this.matchmakingService.leaveQueue().subscribe({
      next: () => {
        this.isInQueue = false;
        this.queuePosition = null;
        this.estimatedWaitTime = null;
        this.matchmakingService.clearSavedQueueState();
      },
      error: error => {
        console.error('Error leaving queue:', error);
        // Still update UI even if backend call fails
        this.isInQueue = false;
        this.queuePosition = null;
        this.estimatedWaitTime = null;
        this.matchmakingService.clearSavedQueueState();
      }
    });
  }

  goBack(): void {
    if (this.isInQueue) {
      this.leaveQueue();
    }
    this.location.back();
  }

  formatWaitTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }

  dismissError(): void {
    this.errorMessage = null;
    // Reset connection state to ensure clean state
    this.matchmakingService.resetConnection();
  }

  retryJoinQueue(): void {
    // Clear error and reset state
    this.errorMessage = null;
    this.isInQueue = false;
    this.queuePosition = null;
    this.estimatedWaitTime = null;
    this.isConnecting = false;

    // Reset connection state
    this.matchmakingService.resetConnection();

    // Wait a bit longer for socket to fully disconnect and cleanup
    setTimeout(() => {
      this.joinQueue();
    }, 300);
  }

  private restoreQueueConnection(): void {
    // Attempt to reconnect to queue
    this.isConnecting = true;
    this.matchmakingService.reconnectToQueue().subscribe({
      next: response => {
        this.isConnecting = false;
        if (response.success) {
          this.isInQueue = true;
          this.queuePosition = response.position || null;
          this.estimatedWaitTime = response.estimatedWaitTime || null;
        } else {
          // Queue state was lost, clear it
          this.matchmakingService.clearSavedQueueState();
        }
      },
      error: error => {
        this.isConnecting = false;
        this.matchmakingService.clearSavedQueueState();
        console.error('Error reconnecting to queue:', error);
      }
    });
  }
}
