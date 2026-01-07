import { Injectable } from '@angular/core';

/**
 * Handles zone assignment logic for 2-player games.
 */
@Injectable({ providedIn: 'root' })
export class ZoneAssignmentService {
  private player1AssignedZone: 'left-walkable-zone' | 'right-walkable-zone' = 'left-walkable-zone';
  private player2AssignedZone: 'left-walkable-zone' | 'right-walkable-zone' = 'right-walkable-zone';
  private zoneAssignmentDetermined = false;

  /**
   * Determine zone assignment based on player IDs (deterministic).
   */
  determineZoneAssignment(player1Id: string, player2Id: string): void {
    const player1GetsLeft = player1Id < player2Id;

    this.player1AssignedZone = player1GetsLeft ? 'left-walkable-zone' : 'right-walkable-zone';
    this.player2AssignedZone = player1GetsLeft ? 'right-walkable-zone' : 'left-walkable-zone';

    // eslint-disable-next-line no-console
    console.log('📊 Zone Assignment (deterministic by player1 vs player2 IDs):', {
      player1Id,
      player2Id,
      player1Zone: this.player1AssignedZone,
      player2Zone: this.player2AssignedZone
    });

    this.zoneAssignmentDetermined = true;
  }

  /**
   * Check if zones have been assigned.
   */
  hasAssignedZones(): boolean {
    return (
      this.player1AssignedZone !== 'left-walkable-zone' ||
      this.player2AssignedZone !== 'right-walkable-zone'
    );
  }

  /**
   * Check if zone assignment is determined.
   */
  isZoneAssignmentDetermined(): boolean {
    return this.zoneAssignmentDetermined;
  }

  /**
   * Get player zone (player1 or player2).
   */
  getPlayerZone(isPlayer1: boolean): 'left-walkable-zone' | 'right-walkable-zone' {
    return isPlayer1 ? this.player1AssignedZone : this.player2AssignedZone;
  }

  /**
   * Get assigned zones for both players.
   */
  getAssignedZones(): {
    player1Zone: 'left-walkable-zone' | 'right-walkable-zone';
    player2Zone: 'left-walkable-zone' | 'right-walkable-zone';
  } {
    return {
      player1Zone: this.player1AssignedZone,
      player2Zone: this.player2AssignedZone
    };
  }

  /**
   * Set assigned zones (from backend).
   */
  setAssignedZones(
    player1Zone: 'left-walkable-zone' | 'right-walkable-zone',
    player2Zone: 'left-walkable-zone' | 'right-walkable-zone'
  ): void {
    this.player1AssignedZone = player1Zone;
    this.player2AssignedZone = player2Zone;
    this.zoneAssignmentDetermined = true;
  }
}
