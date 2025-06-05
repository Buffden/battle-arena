import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatchmakingService, MatchFound } from '../services/matchmaking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matchmaking.component.html',
  styleUrl: './matchmaking.component.css'
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  isInQueue = false;
  matchFound: MatchFound | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private matchmakingService: MatchmakingService,
    public router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.matchmakingService.onQueueStatusChange().subscribe(
        status => this.isInQueue = status
      ),
      this.matchmakingService.onMatchFound().subscribe(
        match => {
          this.matchFound = match;
          // Navigate to game lobby after a short delay
          setTimeout(() => {
            this.router.navigate(['/game', match.lobbyId]);
          }, 2000);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.matchmakingService.disconnect();
  }

  toggleQueue() {
    if (this.isInQueue) {
      this.matchmakingService.leaveQueue();
    } else {
      this.matchmakingService.joinQueue();
    }
  }
}
