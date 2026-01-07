import { Injectable } from '@angular/core';

/**
 * Handles tank spawn position calculations with viewport scaling.
 */
@Injectable({ providedIn: 'root' })
export class TankSpawnerService {
  /**
   * Calculate spawn positions scaled to current viewport.
   * @param arenaData Arena configuration with spawn positions and scale factors
   * @param scaleX Viewport scale factor (x-axis)
   * @param scaleY Viewport scale factor (y-axis)
   * @returns Scaled spawn positions for left and right players
   */
  calculateSpawnPositions(
    arenaData: {
      spawnPositions?: {
        leftPlayer: { x: number; y: number };
        rightPlayer: { x: number; y: number };
      };
    },
    scaleX: number,
    scaleY: number,
    currentWidth: number,
    currentHeight: number
  ): { leftSpawn: { x: number; y: number }; rightSpawn: { x: number; y: number } } {
    const isPercentage = (point: { x: number; y: number }): boolean =>
      point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1;

    const scaleOrConvert = (point: { x: number; y: number }): { x: number; y: number } => {
      if (isPercentage(point)) {
        // Percentage-based coordinates: multiply by current viewport size
        return {
          x: point.x * currentWidth,
          y: point.y * currentHeight
        };
      }
      // Pixel coordinates (reference space): scale to current viewport
      return {
        x: scaleX * point.x,
        y: scaleY * point.y
      };
    };

    // Scale spawn positions by current viewport ratio relative to reference dimensions
    if (arenaData.spawnPositions?.leftPlayer && arenaData.spawnPositions?.rightPlayer) {
      return {
        leftSpawn: scaleOrConvert(arenaData.spawnPositions.leftPlayer),
        rightSpawn: scaleOrConvert(arenaData.spawnPositions.rightPlayer)
      };
    }

    // Fallback defaults, also scaled
    return {
      leftSpawn: { x: scaleX * 200, y: scaleY * 400 },
      rightSpawn: { x: scaleX * 1400, y: scaleY * 400 }
    };
  }

  /**
   * Get texture key for a given tank angle.
   */
  getPanzer4TextureKey(angle: number): string {
    return `panzer4-merged-${angle}`;
  }

  /**
   * Get all available Panzer4 angles.
   */
  getPanzer4Angles(): number[] {
    return [0, 45, 90, 135, 180, 225, 270, 315];
  }

  /**
   * Get texture file path for a given angle.
   */
  getPanzer4TextureFile(angle: number): string {
    const files: Record<number, string> = {
      0: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_0.png',
      45: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_45.png',
      90: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_90.png',
      135: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_135.png',
      180: 'assets/heroes/tanks/panzer_export/Merged/german_panzer__merged_180.png',
      225: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_225.png',
      270: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_270.png',
      315: 'assets/heroes/tanks/panzer_export/Merged/german_panzer_merged_315.png'
    };
    return files[angle] || files[0];
  }
}
