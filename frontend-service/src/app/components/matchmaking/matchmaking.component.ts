import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatchmakingService } from '../../services/matchmaking.service';
import { AuthService } from '../../services/auth.service';
import { MatchFoundModalComponent } from './match-found-modal.component';

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule, RouterModule, MatchFoundModalComponent],
  templateUrl: './matchmaking.component.html',
  styleUrl: './matchmaking.component.css'
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  isInQueue = false;
  queuePosition: number | null = null;
  estimatedWaitTime: number | null = null;
  isConnecting = false;
  errorMessage: string | null = null;
  matchFoundData: {
    matchId: string;
    gameRoomId: string;
    opponent: { userId: string; heroId: string };
    timestamp: number;
    timeout: number;
  } | null = null;
  private routerSubscription?: Subscription;
  private queueSubscriptions = new Subscription();

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check if user was in queue before page refresh
    const savedQueueState = this.matchmakingService.getSavedQueueState();
    if (savedQueueState?.isInQueue) {
      // Restore queue connection
      this.restoreQueueConnection();
    }

    // Listen to router navigation events (including dashboard link, back button, etc.)
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        // Check if navigating away from matchmaking page
        const navigation = event as NavigationStart;
        // Check if navigating to a different route (not just query params or fragments)
        const currentUrl = this.router.url.split('?')[0].split('#')[0]; // Remove query params and fragments
        const targetUrl = navigation.url.split('?')[0].split('#')[0]; // Remove query params and fragments

        if (targetUrl !== '/matchmaking' && currentUrl === '/matchmaking' && this.isInQueue) {
          // eslint-disable-next-line no-console
          console.log(`Navigating away from matchmaking to ${targetUrl} - leaving queue`);
          this.leaveQueue();
        }
      });
  }

  ngOnDestroy(): void {
    // Leave queue when component is destroyed (e.g., navigating away)
    // Note: This will also trigger on page refresh, but that's okay -
    // the backend will handle reconnection via the reconnect-queue mechanism
    if (this.isInQueue) {
      // eslint-disable-next-line no-console
      console.log('Component destroyed while in queue - leaving queue');
      this.leaveQueue();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Unsubscribe from all queue-related subscriptions to prevent memory leaks
    this.queueSubscriptions.unsubscribe();
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

    // Unsubscribe from any existing subscriptions to prevent duplicates
    this.queueSubscriptions.unsubscribe();
    this.queueSubscriptions = new Subscription();

    this.queueSubscriptions.add(
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
      })
    );

    // Setup all queue-related subscriptions
    this.setupQueueSubscriptions();
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
    // Leave queue before navigating back
    if (this.isInQueue) {
      // eslint-disable-next-line no-console
      console.log('Back button clicked - leaving queue');
      this.leaveQueue();
    }
    this.location.back();
  }

  /**
   * Handle navigation to dashboard
   * Called when dashboard link is clicked
   */
  onDashboardClick(): void {
    // Leave queue before navigating to dashboard
    if (this.isInQueue) {
      // eslint-disable-next-line no-console
      console.log('Dashboard link clicked - leaving queue');
      this.leaveQueue();
    }
    // Navigation will happen via routerLink
  }

  onMatchAccepted(matchId: string): void {
    // eslint-disable-next-line no-console
    console.log('✅ Match accepted in component:', matchId);
    // Don't close modal yet - wait for both players to accept
    // Modal will handle the rest via service
  }

  onMatchRejected(matchId: string): void {
    // eslint-disable-next-line no-console
    console.log('❌ Match rejected in component:', matchId);
    // Close modal immediately on rejection
    this.matchFoundData = null;
    // Clear queue status since player rejected
    this.isInQueue = false;
    this.queuePosition = null;
    this.estimatedWaitTime = null;
  }

  onMatchConfirmed(matchId: string): void {
    // eslint-disable-next-line no-console
    console.log('🎮 Match confirmed in component:', matchId);
    // Navigation is handled by subscription
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
    // Also clear any stale match data
    this.matchFoundData = null;

    // Reset connection state
    this.matchmakingService.resetConnection();

    // Wait a bit longer for socket to fully disconnect and cleanup
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('🔄 Retrying to join queue...');
      this.joinQueue();
    }, 500); // Increased delay to ensure clean disconnect
  }

  private restoreQueueConnection(): void {
    // Attempt to reconnect to queue
    this.isConnecting = true;

    // Unsubscribe from any existing subscriptions to prevent duplicates
    this.queueSubscriptions.unsubscribe();
    this.queueSubscriptions = new Subscription();

    this.queueSubscriptions.add(
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
      })
    );

    // Setup all queue-related subscriptions
    this.setupQueueSubscriptions();
  }

  /**
   * Sets up all queue-related subscriptions.
   * This method is called from both joinQueue() and restoreQueueConnection() to avoid code duplication.
   */
  private setupQueueSubscriptions(): void {
    // Subscribe to queue status updates
    this.queueSubscriptions.add(
      this.matchmakingService.getQueueStatus$().subscribe({
        next: status => {
          if (status) {
            // Only log significant changes
            // eslint-disable-next-line no-console
            // console.log('Queue status update received:', status);
            this.queuePosition = status.position;
            this.estimatedWaitTime = status.estimatedWaitTime;
            this.isInQueue = true; // Ensure we're marked as in queue when status is received
            this.errorMessage = null; // Clear any previous errors
          } else {
            // Queue status cleared (e.g., timeout or leave)
            // eslint-disable-next-line no-console
            // console.log('Queue status cleared');
            this.isInQueue = false;
            this.queuePosition = null;
            this.estimatedWaitTime = null;
          }
        },
        error: error => {
          console.error('Error receiving queue status:', error);
        }
      })
    );

    // Subscribe to queue timeout events (direct listener for immediate UI update)
    this.queueSubscriptions.add(
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
      })
    );

    // Subscribe to queue disconnection events (multiple timeouts)
    this.queueSubscriptions.add(
      this.matchmakingService.getQueueDisconnected$().subscribe({
        next: (data: { message?: string; reason?: string; timeoutCount?: number }) => {
          // Immediately update UI on disconnection
          this.isInQueue = false;
          this.queuePosition = null;
          this.estimatedWaitTime = null;
          this.errorMessage =
            data.message ||
            'You have been disconnected from the queue due to multiple match acceptance timeouts. Please try again later.';
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error('Error receiving queue disconnection:', error);
        }
      })
    );

    // Subscribe to match found events
    this.queueSubscriptions.add(
      this.matchmakingService.getMatchFound$().subscribe({
        next: match => {
          // eslint-disable-next-line no-console
          console.log('🎮 Match found:', match.matchId);
          // CRITICAL: Only show modal if no match is currently being processed
          // This prevents showing multiple modals when multiple matches are found
          if (this.matchFoundData) {
            // eslint-disable-next-line no-console
            console.warn(
              `⚠️ Ignoring match-found for ${match.matchId} - already processing match ${this.matchFoundData.matchId}`
            );
            return;
          }
          // Show match acceptance modal
          this.matchFoundData = {
            matchId: match.matchId,
            gameRoomId: match.gameRoomId,
            opponent: match.opponent,
            timestamp: match.timestamp,
            timeout: match.timeout
          };
          // Force change detection to ensure modal displays
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error receiving match found:', error);
        }
      })
    );

    // Subscribe to match confirmed (both players accepted)
    this.queueSubscriptions.add(
      this.matchmakingService.getMatchConfirmed$().subscribe({
        next: confirmed => {
          // eslint-disable-next-line no-console
          console.log('✅ Match confirmed, navigating to game:', confirmed.matchId);
          // Clear match data and navigate to game with state
          this.matchFoundData = null;
          this.matchmakingService.clearSavedQueueState();
          // Pass opponent info via route state
          this.router.navigate(['/game', confirmed.matchId], {
            state: {
              opponentId: confirmed.opponentId,
              gameRoomId: confirmed.gameRoomId
            }
          });
        },
        error: error => {
          console.error('Error receiving match confirmed:', error);
        }
      })
    );

    // Subscribe to match rejected
    this.queueSubscriptions.add(
      this.matchmakingService.getMatchRejected$().subscribe({
        next: rejected => {
          // eslint-disable-next-line no-console
          console.log('❌ Match rejected:', rejected);
          // Close modal immediately - accepting player will get a new match with new match ID
          this.matchFoundData = null;
          // eslint-disable-next-line no-console
          console.log('✓ Modal closed. Waiting for new match with new match ID...');
        },
        error: error => {
          console.error('Error receiving match rejected:', error);
        }
      })
    );

    // Subscribe to match acceptance expired (when timer runs out)
    this.queueSubscriptions.add(
      this.matchmakingService.getMatchAcceptanceExpired$().subscribe({
        next: expired => {
          // eslint-disable-next-line no-console
          console.log('⏱️ Match acceptance expired:', expired);
          // Clear match data so user can receive new matches
          if (expired.matchId === this.matchFoundData?.matchId) {
            this.matchFoundData = null;
            // eslint-disable-next-line no-console
            console.log(
              `✓ Match ${expired.matchId} data cleared. User will be re-added to queue and can receive new matches.`
            );
          }
        },
        error: error => {
          console.error('Error receiving match acceptance expired:', error);
        }
      })
    );
  }
}
