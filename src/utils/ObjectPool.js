// ============================================
// OBJECT POOLING SYSTEM
// ============================================
// Reuses objects instead of creating/destroying them
// Reduces garbage collection and improves performance

/**
 * Object Pool for Three.js meshes
 * Pre-creates objects and reuses them to avoid GC overhead
 */
class ObjectPool {
  constructor(maxSize = 100) {
    this.pool = [];
    this.active = [];
    this.maxSize = maxSize;
  }

  /**
   * Get an object from the pool or create a new one
   * @param {Function} createFn - Function that creates a new object
   * @returns {THREE.Object3D} Object from pool
   */
  acquire(createFn) {
    let obj;

    if (this.pool.length > 0) {
      // Reuse from pool
      obj = this.pool.pop();
      obj.visible = true;
    } else {
      // Create new if pool is empty
      obj = createFn();
    }

    this.active.push(obj);
    return obj;
  }

  /**
   * Return an object to the pool
   * @param {THREE.Object3D} obj - Object to return
   */
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
    }

    // Hide object and reset transform
    obj.visible = false;
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
    obj.scale.set(1, 1, 1);

    // Add to pool if not at capacity
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    } else {
      // Dispose if pool is full
      this.disposeObject(obj);
    }
  }

  /**
   * Release oldest objects if max capacity is reached
   * @param {number} maxActive - Maximum active objects
   */
  enforceMaxActive(maxActive) {
    while (this.active.length > maxActive) {
      const oldest = this.active.shift();
      this.release(oldest);
    }
  }

  /**
   * Dispose an object completely
   * @param {THREE.Object3D} obj
   */
  disposeObject(obj) {
    obj.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  /**
   * Clear the entire pool
   */
  clear() {
    // Dispose all pooled objects
    this.pool.forEach(obj => this.disposeObject(obj));
    this.pool = [];

    // Release all active objects
    while (this.active.length > 0) {
      const obj = this.active.pop();
      this.disposeObject(obj);
    }
  }

  /**
   * Get pool statistics
   * @returns {Object} Pool stats
   */
  getStats() {
    return {
      pooled: this.pool.length,
      active: this.active.length,
      total: this.pool.length + this.active.length,
      capacity: this.maxSize
    };
  }
}

export default ObjectPool;
