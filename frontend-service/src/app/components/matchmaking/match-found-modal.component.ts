import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatchmakingService } from '../../services/matchmaking.service';
import { AuthService } from '../../services/auth.service';
import { matchmakingConfig } from '../../config/matchmaking.config';

interface MatchFoundData {
  matchId: string;
  gameRoomId: string;
  opponent: {
    userId: string;
    heroId: string;
  };
  timestamp: number;
  timeout: number;
}

interface AcceptanceStatus {
  player1Id: string;
  player2Id: string;
  player1Accepted: boolean;
  player2Accepted: boolean;
  player1Rejected: boolean;
  player2Rejected: boolean;
  bothAccepted: boolean;
}

@Component({
  selector: 'app-match-found-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-found-modal.component.html',
  styleUrl: './match-found-modal.component.css'
})
export class MatchFoundModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() matchData: MatchFoundData | null = null;
  @Output() matchAccepted = new EventEmitter<string>();
  @Output() matchRejected = new EventEmitter<string>();
  @Output() matchConfirmed = new EventEmitter<string>();

  acceptanceStatus: AcceptanceStatus | null = null;
  timeRemaining = matchmakingConfig.matchAcceptance.defaultTimeoutSeconds;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private readonly subscriptions = new Subscription();
  private readonly currentUserId: string | null;
  private hasAttemptedReject = false; // Prevent multiple rejection attempts
  private hasAttemptedAccept = false; // Prevent multiple acceptance attempts

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly authService: AuthService
  ) {
    // Get current user ID
    this.currentUserId = this.authService.getUserIdFromToken();

    // Subscribe to acceptance updates
    this.subscriptions.add(
      this.matchmakingService.getMatchAcceptanceUpdate$().subscribe({
        next: update => {
          if (update.matchId === this.matchData?.matchId) {
            this.acceptanceStatus = {
              player1Id: update.player1Id,
              player2Id: update.player2Id,
              player1Accepted: update.player1Accepted,
              player2Accepted: update.player2Accepted,
              player1Rejected: update.player1Rejected,
              player2Rejected: update.player2Rejected,
              bothAccepted: update.bothAccepted
            };

            if (update.bothAccepted) {
              this.stopCountdown();
            }
          }
        }
      })
    );

    // Subscribe to match rejected
    this.subscriptions.add(
      this.matchmakingService.getMatchRejected$().subscribe({
        next: rejected => {
          if (rejected.matchId === this.matchData?.matchId) {
            // eslint-disable-next-line no-console
            console.log(`❌ Match ${rejected.matchId} was rejected - closing modal`);
            // Stop countdown and clear match data immediately
            // The accepting player will get a new match with a new match ID
            this.stopCountdown();
            this.matchData = null; // Clear match data so modal closes
            this.acceptanceStatus = null;
          }
        }
      })
    );

    // Subscribe to match confirmed
    this.subscriptions.add(
      this.matchmakingService.getMatchConfirmed$().subscribe({
        next: confirmed => {
          if (confirmed.matchId === this.matchData?.matchId) {
            this.matchConfirmed.emit(confirmed.matchId);
          }
        }
      })
    );

    // Subscribe to match acceptance expired (when timer runs out)
    // This will close the modal and user will be re-added to queue
    this.subscriptions.add(
      this.matchmakingService.getMatchAcceptanceExpired$().subscribe({
        next: expired => {
          if (expired.matchId === this.matchData?.matchId) {
            // eslint-disable-next-line no-console
            console.log(
              `⏱️ Match ${expired.matchId} acceptance expired - closing modal, user will be re-added to queue`
            );
            this.stopCountdown();
            this.matchData = null; // Close modal
            this.acceptanceStatus = null;
          }
        }
      })
    );
  }

  ngOnInit(): void {
    // Countdown will be started by ngOnChanges when matchData is set
    // This prevents duplicate countdown starts
    if (this.matchData) {
      this.startCountdown();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchData']) {
      if (
        this.matchData &&
        (!changes['matchData'].previousValue || changes['matchData'].firstChange)
      ) {
        // Match data was just set, start countdown
        this.startCountdown();
      } else if (!this.matchData && changes['matchData'].previousValue) {
        // Match data was cleared, stop countdown
        this.stopCountdown();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    this.subscriptions.unsubscribe();
  }

  startCountdown(): void {
    // Stop any existing countdown to prevent duplicates
    this.stopCountdown();

    // Reset flags when starting new countdown
    this.hasAttemptedReject = false;
    this.hasAttemptedAccept = false;

    // Calculate time remaining based on timeout and timestamp
    if (this.matchData?.timestamp) {
      const elapsed = Date.now() - this.matchData.timestamp;
      const remaining = Math.max(0, this.matchData.timeout - elapsed);
      this.timeRemaining = Math.floor(remaining / 1000);
    } else if (this.matchData) {
      // Fallback if timestamp is not available
      this.timeRemaining = Math.floor(this.matchData.timeout / 1000);
    } else {
      // Default fallback
      this.timeRemaining = matchmakingConfig.matchAcceptance.defaultTimeoutSeconds;
    }

    // Only start countdown if there's time remaining
    if (this.timeRemaining <= 0) {
      // Time already expired, just close modal - backend will handle it
      if (this.matchData && !this.hasAttemptedReject && !this.hasAttemptedAccept) {
        this.hasAttemptedReject = true;
        // Clear match data to close modal - backend will handle the rest
        this.matchData = null;
        this.acceptanceStatus = null;
        // eslint-disable-next-line no-console
        console.log('⏱️ Match acceptance timer already expired - modal closing');
      }
      return;
    }

    // eslint-disable-next-line no-console
    console.log(
      `[Countdown] Starting countdown for match ${this.matchData?.matchId}: ${this.timeRemaining} seconds remaining`
    );

    // Start countdown interval
    this.countdownInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.stopCountdown();
        // On timeout, just close the modal - backend will handle moving to end of queue
        // Don't call onReject() as that sends a rejection event
        // The backend will detect expiration and handle it automatically
        if (this.matchData && !this.hasAttemptedReject && !this.hasAttemptedAccept) {
          this.hasAttemptedReject = true; // Mark as attempted to prevent retries
          // Clear match data to close modal - backend will handle the rest
          this.matchData = null;
          this.acceptanceStatus = null;
          // eslint-disable-next-line no-console
          console.log(
            '⏱️ Match acceptance timer expired - modal closing, backend will handle queue re-adding'
          );
        }
      }
    }, matchmakingConfig.matchAcceptance.countdownIntervalMs);
  }

  stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  onAccept(): void {
    // Prevent multiple acceptance attempts
    if (this.hasAttemptedAccept || this.hasAttemptedReject) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Accept already attempted, ignoring');
      return;
    }

    if (this.matchData) {
      this.hasAttemptedAccept = true;
      this.stopCountdown(); // Stop countdown when action is taken

      // eslint-disable-next-line no-console
      console.log('✅ User clicked ACCEPT for match:', this.matchData.matchId);
      this.matchmakingService.acceptMatch(this.matchData.matchId);
      this.matchAccepted.emit(this.matchData.matchId);
    } else {
      // eslint-disable-next-line no-console
      console.error('❌ Cannot accept: matchData is null');
    }
  }

  onReject(): void {
    // Prevent multiple rejection attempts
    if (this.hasAttemptedReject || this.hasAttemptedAccept) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Reject already attempted, ignoring');
      return;
    }

    if (this.matchData) {
      this.hasAttemptedReject = true;
      this.stopCountdown(); // Stop countdown when action is taken

      // eslint-disable-next-line no-console
      console.log('❌ User clicked REJECT for match:', this.matchData.matchId);

      // Check if socket is connected before attempting to reject
      // If not connected, just close the modal without sending to backend
      const rejected = this.matchmakingService.rejectMatch(this.matchData.matchId);
      if (!rejected) {
        // eslint-disable-next-line no-console
        console.warn('⚠️ Socket not connected, closing modal without backend notification');
      }

      this.matchRejected.emit(this.matchData.matchId);
    } else {
      // eslint-disable-next-line no-console
      console.error('❌ Cannot reject: matchData is null');
    }
  }

  /**
   * Check if current user is player1
   */
  private isCurrentUserPlayer1(): boolean {
    if (!this.acceptanceStatus || !this.currentUserId) {
      return false;
    }
    return this.acceptanceStatus.player1Id === this.currentUserId;
  }

  /**
   * Check if current user has accepted
   */
  hasCurrentUserAccepted(): boolean {
    if (!this.acceptanceStatus || !this.currentUserId) {
      return false;
    }

    if (this.isCurrentUserPlayer1()) {
      return this.acceptanceStatus.player1Accepted;
    } else {
      return this.acceptanceStatus.player2Accepted;
    }
  }

  /**
   * Check if opponent has accepted
   */
  hasOpponentAccepted(): boolean {
    if (!this.acceptanceStatus || !this.currentUserId) {
      return false;
    }

    if (this.isCurrentUserPlayer1()) {
      return this.acceptanceStatus.player2Accepted;
    } else {
      return this.acceptanceStatus.player1Accepted;
    }
  }

  /**
   * Check if opponent has rejected
   */
  hasOpponentRejected(): boolean {
    if (!this.acceptanceStatus || !this.currentUserId) {
      return false;
    }

    if (this.isCurrentUserPlayer1()) {
      return this.acceptanceStatus.player2Rejected;
    } else {
      return this.acceptanceStatus.player1Rejected;
    }
  }
}
