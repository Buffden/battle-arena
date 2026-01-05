/**
 * Game State Types
 *
 * Types for game state management, hero data, and game events.
 */

import Phaser from 'phaser';

export interface Hero {
  id: string;
  userId: string;
  heroId: string;
  position: {
    x: number;
    y: number;
  };
  facingAngle?: number;
  health: number;
  maxHealth: number;
  score: number;
  movesRemaining: number;
}

export interface GameState {
  matchId: string;
  gameRoomId: string;
  currentTurn: string; // userId of current player
  turnNumber: number;
  turnTimeRemaining: number; // seconds
  player1: Hero;
  player2: Hero;
  arena: {
    width: number;
    height: number;
    terrain: string; // terrain type identifier
  };
  gameStatus: 'waiting' | 'active' | 'paused' | 'finished';
  winner?: string; // userId of winner
  zoneAssignments?: {
    player1Zone: 'left-walkable-zone' | 'right-walkable-zone';
    player2Zone: 'left-walkable-zone' | 'right-walkable-zone';
  };
  createdAt: number;
  updatedAt: number;
}

export interface WalkableZone {
  id: string;
  polygon: Phaser.Geom.Polygon;
}

export interface GameStartedEvent {
  matchId: string;
  gameRoomId: string;
  gameState: GameState;
}

export interface GameStateUpdateEvent {
  matchId: string;
  gameRoomId: string;
  gameState: GameState;
}

export interface GameErrorEvent {
  error: string;
  message: string;
  matchId?: string;
}
