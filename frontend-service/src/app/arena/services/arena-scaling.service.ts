import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

/**
 * Handles viewport-to-reference coordinate scaling and polygon rescaling.
 */
@Injectable({ providedIn: 'root' })
export class ArenaScalingService {
  private referenceArenaWidth = 1511;
  private referenceArenaHeight = 860;
  private currentArenaWidth = this.referenceArenaWidth;
  private currentArenaHeight = this.referenceArenaHeight;
  private originalWalkableZones = new Map<string, { x: number; y: number }[]>();
  private originalArenaBounds: { x: number; y: number; width: number; height: number } | null =
    null;
  private walkableZones = new Map<string, { id: string; polygon: Phaser.Geom.Polygon }>();

  arenaBounds = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  };

  /**
   * Initialize reference dimensions and current dimensions.
   */
  initializeFromArenaData(
    refWidth: number,
    refHeight: number,
    currentWidth: number,
    currentHeight: number
  ): void {
    this.referenceArenaWidth = refWidth;
    this.referenceArenaHeight = refHeight;
    this.currentArenaWidth = currentWidth;
    this.currentArenaHeight = currentHeight;
  }

  /**
   * Update current arena dimensions (called on window resize or init).
   */
  updateDimensions(width: number, height: number): void {
    this.currentArenaWidth = width;
    this.currentArenaHeight = height;
  }

  /**
   * Get current scale factors (viewport / reference).
   */
  getScaleFactors(): { x: number; y: number } {
    return {
      x: this.currentArenaWidth / this.referenceArenaWidth,
      y: this.currentArenaHeight / this.referenceArenaHeight
    };
  }

  /**
   * Get the reference (canonical) arena dimensions.
   */
  getReferenceDimensions(): { width: number; height: number } {
    return {
      width: this.referenceArenaWidth,
      height: this.referenceArenaHeight
    };
  }

  /**
   * Get the current arena dimensions (viewport-sized).
   */
  getCurrentDimensions(): { width: number; height: number } {
    return {
      width: this.currentArenaWidth,
      height: this.currentArenaHeight
    };
  }

  /**
   * Store original polygon coordinates (canonical, unscaled).
   */
  storeOriginalPolygon(zoneId: string, polygon: { x: number; y: number }[]): void {
    if (!this.originalWalkableZones.has(zoneId)) {
      this.originalWalkableZones.set(zoneId, JSON.parse(JSON.stringify(polygon)));
    }
  }

  /**
   * Register a walkable zone with scaled coordinates.
   */
  registerWalkableZone(
    zoneId: string,
    originalPolygon: { x: number; y: number }[],
    scaleX?: number,
    scaleY?: number
  ): void {
    this.storeOriginalPolygon(zoneId, originalPolygon);
    this.rescalePolygon(zoneId, scaleX, scaleY);
  }

  /**
   * Rescale all walkable zones based on current viewport ratio.
   */
  rescaleAllPolygons(): void {
    if (this.originalWalkableZones.size === 0) return;
    const { x: scaleX, y: scaleY } = this.getScaleFactors();
    for (const [zoneId] of this.originalWalkableZones.entries()) {
      this.rescalePolygon(zoneId, scaleX, scaleY);
    }
  }

  /**
   * Rescale a single polygon.
   */
  private rescalePolygon(zoneId: string, scaleX?: number, scaleY?: number): void {
    const original = this.originalWalkableZones.get(zoneId);
    if (!original) return;

    const scales = scaleX === undefined ? this.getScaleFactors() : { x: scaleX, y: scaleY! };
    const scaledPoints = this.scalePolygonCoordinates(original, scales.x, scales.y).flatMap(p => [
      p.x,
      p.y
    ]);
    const poly = new Phaser.Geom.Polygon(scaledPoints);
    this.walkableZones.set(zoneId, { id: zoneId, polygon: poly });
  }

  /**
   * Get the scaled walkable polygon for a zone.
   */
  getWalkableZone(zoneId: string): Phaser.Geom.Polygon | null {
    return this.walkableZones.get(zoneId)?.polygon ?? null;
  }

  /**
   * Rescale arena bounds based on original bounds.
   */
  rescaleArenaBounds(originalBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    const bounds = originalBounds || this.originalArenaBounds;
    if (!bounds) return;
    const { x: scaleX, y: scaleY } = this.getScaleFactors();
    const { x, y, width, height } = bounds;
    this.arenaBounds = {
      minX: x * scaleX,
      minY: y * scaleY,
      maxX: (x + width) * scaleX,
      maxY: (y + height) * scaleY
    };
    if (originalBounds && !this.originalArenaBounds) {
      this.originalArenaBounds = originalBounds;
    }
  }

  /**
   * Scale polygon coordinates by factors.
   */
  private scalePolygonCoordinates(
    polygon: { x: number; y: number }[],
    scaleX: number,
    scaleY: number
  ): { x: number; y: number }[] {
    return polygon.map(p => ({ x: p.x * scaleX, y: p.y * scaleY }));
  }

  /**
   * Get all walkable zones (for initialization).
   */
  getAllWalkableZones(): Map<string, { id: string; polygon: Phaser.Geom.Polygon }> {
    return this.walkableZones;
  }
}
