// Matchmaking Types
// Type definitions for matchmaking-related data structures

// QueueStatus - Queue information returned from backend
export interface QueueStatus {
  position: number; // Player's position in queue (0-based, -1 if not in queue)
  estimatedWaitTime: number; // Estimated wait time in seconds
  queueSize: number; // Total number of players in queue
}

// Matchmaking Events
// Socket.io event names for matchmaking
export enum MatchmakingEvent {
  JOIN_QUEUE = 'join-queue',
  LEAVE_QUEUE = 'leave-queue',
  QUEUE_STATUS = 'queue-status',
  QUEUE_LEFT = 'queue-left',
  ERROR = 'error'
}

// MatchmakingError - Error response from matchmaking service
export interface MatchmakingError {
  message: string;
  error?: string;
}
