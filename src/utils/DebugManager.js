/**
 * Centralized Debug Manager
 * Tracks performance, errors, component lifecycle, and system events
 */

class DebugManager {
  constructor() {
    this.enabled = true;
    this.logs = [];
    this.errors = [];
    this.performanceMetrics = {
      fps: 0,
      memory: { used: 0, total: 0, limit: 0 },
      renderTime: 0,
      objectCount: 0,
      physicsLoaded: false,
      radarLoaded: false,
      audioLoaded: false,
    };
    this.componentStates = new Map();
    this.timeline = [];
    this.startTime = Date.now();
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.listeners = new Set();

    // Auto-update FPS
    this.fpsInterval = setInterval(() => this.updateFPS(), 1000);

    // Track memory if available
    if (performance.memory) {
      this.memoryInterval = setInterval(() => this.updateMemory(), 2000);
    }
  }

  log(category, message, data = {}) {
    const entry = {
      timestamp: Date.now() - this.startTime,
      category,
      message,
      data,
      type: 'log'
    };

    this.logs.push(entry);
    this.timeline.push(entry);

    // Keep only last 500 logs
    if (this.logs.length > 500) {
      this.logs.shift();
    }

    if (this.enabled) {
      console.log(`[${category}] ${message}`, data);
    }

    this.notifyListeners();
  }

  error(category, message, error) {
    const entry = {
      timestamp: Date.now() - this.startTime,
      category,
      message,
      error: {
        message: error?.message || String(error),
        stack: error?.stack,
        name: error?.name
      },
      type: 'error'
    };

    this.errors.push(entry);
    this.timeline.push(entry);

    console.error(`[${category}] ${message}`, error);

    this.notifyListeners();
  }

  trackComponent(name, state) {
    this.componentStates.set(name, {
      ...state,
      lastUpdate: Date.now() - this.startTime
    });

    this.log('Component', `${name} state updated`, state);
  }

  trackLazyLoad(componentName, loadTime) {
    this.log('LazyLoad', `${componentName} loaded in ${loadTime}ms`, {
      componentName,
      loadTime
    });
  }

  updatePerformance(metrics) {
    Object.assign(this.performanceMetrics, metrics);
    this.notifyListeners();
  }

  updateFPS() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.performanceMetrics.fps = Math.round((this.frameCount * 1000) / delta);
    this.frameCount = 0;
    this.lastFrameTime = now;
  }

  countFrame() {
    this.frameCount++;
  }

  updateMemory() {
    if (performance.memory) {
      this.performanceMetrics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
      this.notifyListeners();
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getState()));
  }

  getState() {
    return {
      logs: this.logs.slice(-100), // Last 100 logs
      errors: this.errors,
      performanceMetrics: this.performanceMetrics,
      componentStates: Array.from(this.componentStates.entries()).map(([name, state]) => ({
        name,
        ...state
      })),
      timeline: this.timeline.slice(-200), // Last 200 events
      uptime: Date.now() - this.startTime
    };
  }

  exportData() {
    return JSON.stringify({
      ...this.getState(),
      exportTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      }
    }, null, 2);
  }

  clear() {
    this.logs = [];
    this.errors = [];
    this.timeline = [];
    this.notifyListeners();
  }

  destroy() {
    clearInterval(this.fpsInterval);
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    this.listeners.clear();
  }
}

// Singleton instance
const debugManager = new DebugManager();

export default debugManager;
