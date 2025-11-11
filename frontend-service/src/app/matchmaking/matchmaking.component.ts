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
    console.log('MatchmakingComponent initialized');
    this.subscriptions.push(
      this.matchmakingService.onQueueStatusChange().subscribe(
        status => {
          this.isInQueue = status;
          console.log('Queue status changed:', status);
        }
      ),
      this.matchmakingService.onMatchFound().subscribe(
        match => {
          this.matchFound = match;
          console.log('Match found:', match);
          // Navigate to arena after a short delay
          setTimeout(() => {
            console.log('Navigating to arena:', match.lobbyId);
            this.router.navigate(['/arena', match.lobbyId]);
          }, 2000);
        }
      )
    );
  }

  ngOnDestroy() {
    console.log('MatchmakingComponent destroyed');
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.matchmakingService.disconnect();
  }

  toggleQueue() {
    if (this.isInQueue) {
      console.log('Leaving queue');
      this.matchmakingService.leaveQueue();
    } else {
      console.log('Joining queue');
      this.matchmakingService.joinQueue();
    }
  }
}
