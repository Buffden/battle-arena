import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

/**
 * Handles opponent tank rendering and position updates.
 */
@Injectable({ providedIn: 'root' })
export class OpponentSyncService {
  private readonly tankBaseScale = 1.2;

  /**
   * Create opponent tank sprite at spawn position.
   */
  createOpponentTank(
    scene: Phaser.Scene,
    spawnPos: { x: number; y: number },
    textureKey: string,
    opponentName: string
  ): { tank: Phaser.GameObjects.Sprite; nameTag: Phaser.GameObjects.Text } {
    const tank = scene.add
      .sprite(spawnPos.x, spawnPos.y, textureKey)
      .setOrigin(0.5, 0.5)
      .setScale(this.tankBaseScale);
    tank.setData('isOpponent', true);

    const nameTag = scene.add
      .text(spawnPos.x, spawnPos.y - 50, opponentName, {
        fontSize: '16px',
        color: '#ff0000',
        align: 'center',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      })
      .setOrigin(0.5, 1)
      .setDepth(1000);

    return { tank, nameTag };
  }

  /**
   * Update opponent tank position and angle.
   */
  updateOpponentTankPosition(
    opponentTank: Phaser.GameObjects.Sprite,
    nameTag: Phaser.GameObjects.Text | null,
    position: { x: number; y: number; facingAngle: number },
    textureKey: string,
    arenaBounds: { minX: number; minY: number; maxX: number; maxY: number }
  ): void {
    opponentTank.x = position.x;
    opponentTank.y = position.y;
    opponentTank.setTexture(textureKey);

    // Update depth based on y position
    const denom = Math.max(1, arenaBounds.maxY - arenaBounds.minY);
    const depthT = Phaser.Math.Clamp((position.y - arenaBounds.minY) / denom, 0, 1);
    const depthScale = Phaser.Math.Linear(0.3, 2.2, depthT);
    opponentTank.setScale(this.tankBaseScale * depthScale);
    opponentTank.setDepth(Math.floor(position.y));

    // Update name tag position
    if (nameTag) {
      nameTag.x = position.x;
      nameTag.y = position.y - 50;
    }
  }

  /**
   * Get tank base scale (for reference).
   */
  getTankBaseScale(): number {
    return this.tankBaseScale;
  }
}
