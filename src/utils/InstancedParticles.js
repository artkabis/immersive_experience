// ============================================
// INSTANCED PARTICLES SYSTEM
// ============================================
// Uses InstancedMesh for massive performance gains
// Renders thousands of particles with a single draw call

import * as THREE from 'three';

/**
 * Create instanced star field with InstancedMesh
 * @param {number} count - Number of stars
 * @returns {THREE.InstancedMesh} Instanced star field
 */
export function createInstancedStarField(count) {
  // Single geometry and material (1 draw call for all stars!)
  const geometry = new THREE.SphereGeometry(0.3, 4, 4); // Very low poly
  const material = new THREE.PointsMaterial({
    size: 0.3,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    sizeAttenuation: true
  });

  // For InstancedMesh approach with spheres (better for bloom)
  const instancedGeometry = new THREE.SphereGeometry(1, 4, 4);
  const instancedMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const instancedMesh = new THREE.InstancedMesh(instancedGeometry, instancedMaterial, count);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Position on sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 50 + Math.random() * 150;

    dummy.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    // Random size
    const size = 0.2 + Math.random() * 0.3;
    dummy.scale.set(size, size, size);

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Color (cyan-white spectrum)
    color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
    instancedMesh.setColorAt(i, color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true;
  }

  // Add animation data
  instancedMesh.userData.rotationSpeed = 0.00005;

  return instancedMesh;
}

/**
 * Create instanced nebula particles with InstancedMesh
 * @param {number} count - Number of nebula particles
 * @returns {THREE.InstancedMesh} Instanced nebula
 */
export function createInstancedNebula(count) {
  const geometry = new THREE.SphereGeometry(1, 6, 6);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });

  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 50 + 15,
      (Math.random() - 0.5) * 100 - 30
    );

    // Random size (larger for nebula)
    const size = 2 + Math.random() * 4;
    dummy.scale.set(size, size, size);

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Color (violet-magenta spectrum)
    const hue = Math.random() * 0.3 + 0.6;
    color.setHSL(hue, 1, 0.5);
    instancedMesh.setColorAt(i, color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true;
  }

  // Add animation data
  instancedMesh.userData.flowSpeed = 0.0001;

  return instancedMesh;
}

/**
 * Animate instanced star field (slow rotation)
 * @param {THREE.InstancedMesh} starField
 * @param {number} deltaTime
 */
export function animateInstancedStarField(starField, deltaTime) {
  if (!starField || !starField.userData.rotationSpeed) return;

  starField.rotation.y += starField.userData.rotationSpeed * deltaTime;
}

/**
 * Animate instanced nebula (slow flow)
 * @param {THREE.InstancedMesh} nebula
 * @param {number} deltaTime
 */
export function animateInstancedNebula(nebula, deltaTime) {
  if (!nebula || !nebula.userData.flowSpeed) return;

  nebula.rotation.y += nebula.userData.flowSpeed * deltaTime;
}

/**
 * Update particle count (recreate with new count)
 * @param {THREE.Scene} scene
 * @param {THREE.InstancedMesh} oldParticles
 * @param {number} newCount
 * @param {string} type - 'stars' or 'nebula'
 * @returns {THREE.InstancedMesh} New instanced particles
 */
export function updateParticleCount(scene, oldParticles, newCount, type) {
  // Remove old
  if (oldParticles) {
    scene.remove(oldParticles);
    oldParticles.geometry.dispose();
    oldParticles.material.dispose();
  }

  // Create new
  const newParticles = type === 'stars'
    ? createInstancedStarField(newCount)
    : createInstancedNebula(newCount);

  scene.add(newParticles);
  return newParticles;
}
