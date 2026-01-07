import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

/**
 * Handles tank movement, collision detection, and movement physics.
 */
@Injectable({ providedIn: 'root' })
export class TankMovementService {
  private readonly tankBaseScale = 1.2;

  /**
   * Update tank position based on input and collision.
   */
  updateTank(
    delta: number,
    tank: Phaser.GameObjects.Sprite,
    keys: Record<string, Phaser.Input.Keyboard.Key>,
    walkableGeom: Phaser.Geom.Polygon,
    arenaBounds: { minX: number; minY: number; maxX: number; maxY: number },
    tankAngle: number,
    nameTag: Phaser.GameObjects.Text | null
  ): {
    moved: boolean;
    newAngle: number;
    newPosition: { x: number; y: number };
  } {
    const denom = Math.max(1, arenaBounds.maxY - arenaBounds.minY);
    const depthT = Phaser.Math.Clamp((tank.y - arenaBounds.minY) / denom, 0, 1);
    const depthScale = Phaser.Math.Linear(0.3, 2.2, depthT);
    const speed = 0.1 * delta * depthScale;

    let dx = 0;
    let dy = 0;

    const up = keys['W']?.isDown || keys['UP']?.isDown;
    const down = keys['S']?.isDown || keys['DOWN']?.isDown;
    const left = keys['A']?.isDown || keys['LEFT']?.isDown;
    const right = keys['D']?.isDown || keys['RIGHT']?.isDown;

    if (up) dy -= 1;
    if (down) dy += 1;
    if (left) dx -= 1;
    if (right) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const inv = Math.SQRT1_2;
      dx *= inv;
      dy *= inv;
    }

    const moveX = dx * speed;
    const moveY = dy * speed;

    let newAngle = tankAngle;
    if (dx !== 0 || dy !== 0) {
      newAngle = this.snapAngleToDirection(dx, dy);
    }

    const fullX = tank.x + moveX;
    const fullY = tank.y + moveY;

    let tankMoved = false;

    if (Phaser.Geom.Polygon.Contains(walkableGeom, fullX, fullY)) {
      tank.x = fullX;
      tank.y = fullY;
      tankMoved = true;

      if (nameTag) {
        nameTag.x = tank.x;
        nameTag.y = tank.y - 50;
      }
    } else {
      const edge = this.getClosestEdge(tank.x, tank.y, walkableGeom);
      if (edge) {
        const projected = this.projectVector(moveX, moveY, edge.x, edge.y);
        const slideX = tank.x + projected.x;
        const slideY = tank.y + projected.y;

        if (Phaser.Geom.Polygon.Contains(walkableGeom, slideX, slideY)) {
          tank.x = slideX;
          tank.y = slideY;
          tankMoved = true;

          if (nameTag) {
            nameTag.x = tank.x;
            nameTag.y = tank.y - 50;
          }
        }
      }
    }

    tank.setScale(this.tankBaseScale * depthScale);
    tank.setDepth(Math.floor(tank.y));

    return {
      moved: tankMoved,
      newAngle,
      newPosition: { x: tank.x, y: tank.y }
    };
  }

  /**
   * Snap direction vector to nearest 45-degree angle.
   */
  snapAngleToDirection(dx: number, dy: number): number {
    const rawDeg = Phaser.Math.RadToDeg(Math.atan2(-dy, dx));
    const normalized = (rawDeg + 360) % 360;
    const snapped = Math.round(normalized / 45) * 45;
    return snapped % 360;
  }

  /**
   * Project a movement vector onto an edge normal.
   */
  projectVector(vx: number, vy: number, tx: number, ty: number): { x: number; y: number } {
    const lenSq = tx * tx + ty * ty;
    if (lenSq === 0) return { x: 0, y: 0 };

    const dot = vx * tx + vy * ty;
    const scale = dot / lenSq;

    return { x: tx * scale, y: ty * scale };
  }

  /**
   * Find the closest edge of the polygon to a point.
   */
  getClosestEdge(
    x: number,
    y: number,
    polygon: Phaser.Geom.Polygon
  ): { x: number; y: number } | null {
    const poly = polygon.points;
    let closestDist = Infinity;
    let edgeDir: { x: number; y: number } | null = null;

    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      const mx = (p1.x + p2.x) * 0.5;
      const my = (p1.y + p2.y) * 0.5;

      const dist = Phaser.Math.Distance.Between(x, y, mx, my);
      if (dist < closestDist) {
        closestDist = dist;
        edgeDir = { x: dx, y: dy };
      }
    }

    return edgeDir;
  }
}
