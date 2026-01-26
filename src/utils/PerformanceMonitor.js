// ============================================
// PERFORMANCE MONITOR & AUTO-QUALITY
// ============================================
// Monitors FPS and automatically adjusts quality settings

import { QUALITY_PRESETS, applyPreset } from './QualityPresets.js';

/**
 * Performance Monitor with FPS tracking and auto-quality adjustment
 */
class PerformanceMonitor {
  constructor() {
    this.fps = 60;
    this.frames = [];
    this.lastTime = performance.now();
    this.avgFPS = 60;

    // Auto-quality settings
    this.autoAdjustEnabled = false;
    this.targetFPS = 60;
    this.currentPreset = 'medium';
    this.adjustCooldown = 0;
    this.adjustCooldownDuration = 5000; // 5 seconds between adjustments

    // Quality order for stepping up/down
    this.qualityOrder = ['low', 'medium', 'high', 'ultra'];

    // FPS history for smoothing
    this.fpsHistory = [];
    this.fpsHistorySize = 60; // 1 second at 60fps
  }

  /**
   * Update FPS calculation
   * Call this every frame
   */
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta > 0) {
      this.fps = 1000 / delta;

      // Add to history
      this.fpsHistory.push(this.fps);
      if (this.fpsHistory.length > this.fpsHistorySize) {
        this.fpsHistory.shift();
      }

      // Calculate average FPS
      this.avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    }

    this.lastTime = now;

    // Update cooldown
    if (this.adjustCooldown > 0) {
      this.adjustCooldown -= delta;
    }
  }

  /**
   * Get current FPS
   * @returns {number} Current FPS
   */
  getFPS() {
    return this.fps;
  }

  /**
   * Get average FPS (smoothed)
   * @returns {number} Average FPS
   */
  getAvgFPS() {
    return this.avgFPS;
  }

  /**
   * Get FPS statistics
   * @returns {Object} FPS stats
   */
  getStats() {
    const min = Math.min(...this.fpsHistory);
    const max = Math.max(...this.fpsHistory);

    return {
      current: Math.round(this.fps),
      average: Math.round(this.avgFPS),
      min: Math.round(min),
      max: Math.round(max)
    };
  }

  /**
   * Enable auto-quality adjustment
   * @param {string} currentPreset - Current quality preset
   * @param {number} targetFPS - Target FPS to maintain
   */
  enableAutoAdjust(currentPreset, targetFPS = 60) {
    this.autoAdjustEnabled = true;
    this.currentPreset = currentPreset;
    this.targetFPS = targetFPS;
    console.log(`[PerformanceMonitor] Auto-quality enabled. Target: ${targetFPS} FPS`);
  }

  /**
   * Disable auto-quality adjustment
   */
  disableAutoAdjust() {
    this.autoAdjustEnabled = false;
    console.log('[PerformanceMonitor] Auto-quality disabled');
  }

  /**
   * Check if quality should be adjusted and return new preset if needed
   * @returns {string|null} New preset name or null if no change needed
   */
  checkAndAdjustQuality() {
    if (!this.autoAdjustEnabled) return null;
    if (this.adjustCooldown > 0) return null;
    if (this.fpsHistory.length < this.fpsHistorySize) return null; // Wait for history

    const currentIndex = this.qualityOrder.indexOf(this.currentPreset);
    const fpsMargin = this.targetFPS * 0.1; // 10% margin

    // FPS too low - downgrade quality
    if (this.avgFPS < this.targetFPS - fpsMargin) {
      if (currentIndex > 0) {
        const newPreset = this.qualityOrder[currentIndex - 1];
        console.log(`[PerformanceMonitor] FPS too low (${Math.round(this.avgFPS)}/${this.targetFPS}), downgrading to ${newPreset}`);
        this.currentPreset = newPreset;
        this.adjustCooldown = this.adjustCooldownDuration;
        this.fpsHistory = []; // Reset history
        return newPreset;
      }
    }

    // FPS very high - upgrade quality (be conservative)
    if (this.avgFPS > this.targetFPS + (fpsMargin * 3)) { // 30% above target
      if (currentIndex < this.qualityOrder.length - 1) {
        const newPreset = this.qualityOrder[currentIndex + 1];
        console.log(`[PerformanceMonitor] FPS high (${Math.round(this.avgFPS)}/${this.targetFPS}), upgrading to ${newPreset}`);
        this.currentPreset = newPreset;
        this.adjustCooldown = this.adjustCooldownDuration;
        this.fpsHistory = []; // Reset history
        return newPreset;
      }
    }

    return null;
  }

  /**
   * Get performance status
   * @returns {string} 'excellent', 'good', 'fair', 'poor'
   */
  getPerformanceStatus() {
    if (this.avgFPS >= 55) return 'excellent';
    if (this.avgFPS >= 40) return 'good';
    if (this.avgFPS >= 25) return 'fair';
    return 'poor';
  }

  /**
   * Get performance color
   * @returns {string} Hex color
   */
  getPerformanceColor() {
    const status = this.getPerformanceStatus();
    switch (status) {
      case 'excellent': return '#00ffc8';
      case 'good': return '#ffdd00';
      case 'fair': return '#ff8800';
      case 'poor': return '#ff0066';
      default: return '#ffffff';
    }
  }

  /**
   * Reset monitor
   */
  reset() {
    this.fps = 60;
    this.avgFPS = 60;
    this.fpsHistory = [];
    this.lastTime = performance.now();
    this.adjustCooldown = 0;
  }
}

export default PerformanceMonitor;
