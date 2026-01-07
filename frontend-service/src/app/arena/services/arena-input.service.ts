import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

/**
 * Handles user input (keyboard and pointer events) for the arena.
 */
@Injectable({ providedIn: 'root' })
export class ArenaInputService {
  private clickCoordinates: { x: number; y: number }[] = [];
  private pendingCursorPos: { x: number; y: number } | null = null;

  /**
   * Initialize keyboard input from the input plugin.
   */
  initializeKeyboard(input: Phaser.Input.InputPlugin): Record<string, Phaser.Input.Keyboard.Key> {
    // Support WASD and arrow keys for movement
    const keys = input.keyboard?.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    return (keys || {}) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  /**
   * Handle pointer down event.
   */
  handlePointerDown(pointer: Phaser.Input.Pointer): { x: number; y: number } {
    const coords = {
      x: Math.round(pointer.worldX),
      y: Math.round(pointer.worldY)
    };
    this.clickCoordinates.push(coords);
    // eslint-disable-next-line no-console
    console.log(this.clickCoordinates);
    return coords;
  }

  /**
   * Handle pointer move event and update cursor position text.
   */
  handlePointerMove(pointer: Phaser.Input.Pointer): { x: number; y: number } {
    return {
      x: Math.round(pointer.worldX),
      y: Math.round(pointer.worldY)
    };
  }

  /**
   * Set pending cursor position.
   */
  setPendingCursorPos(pos: { x: number; y: number } | null): void {
    this.pendingCursorPos = pos;
  }

  /**
   * Get pending cursor position.
   */
  getPendingCursorPos(): { x: number; y: number } | null {
    const pos = this.pendingCursorPos;
    this.pendingCursorPos = null;
    return pos;
  }

  /**
   * Get all click coordinates.
   */
  getClickCoordinates(): { x: number; y: number }[] {
    return this.clickCoordinates;
  }

  /**
   * Clear click coordinates.
   */
  clearClickCoordinates(): void {
    this.clickCoordinates = [];
  }
}
