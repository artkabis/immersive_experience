// ============================================
// INSTANCED PARTICLES SYSTEM
// ============================================
// Uses InstancedMesh for massive performance gains
// Renders thousands of particles with a single draw call
// Can also create classic Points for original look

import * as THREE from 'three';

/**
 * Create star field (InstancedMesh or Points based on useInstancing)
 * @param {number} count - Number of stars
 * @param {boolean} useInstancing - Use InstancedMesh (true) or Points (false, original)
 * @returns {THREE.InstancedMesh|THREE.Points} Star field
 */
export function createInstancedStarField(count, useInstancing = true) {
  if (!useInstancing) {
    // Original Points-based stars (v2.0.0)
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(count * 3);
    const starColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 50 + Math.random() * 150;

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.userData.isPoints = true; // Mark as Points
    starField.userData.rotationSpeed = 0.015;
    return starField;
  }
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
 * Create nebula particles (InstancedMesh or Points based on useInstancing)
 * @param {number} count - Number of nebula particles
 * @param {boolean} useInstancing - Use InstancedMesh (true) or Points (false, original)
 * @returns {THREE.InstancedMesh|THREE.Points} Nebula
 */
export function createInstancedNebula(count, useInstancing = true) {
  if (!useInstancing) {
    // Original Points-based nebula (v2.0.0)
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(count * 3);
    const nebulaColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      nebulaPositions[i * 3] = (Math.random() - 0.5) * 100;
      nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 50 + 15;
      nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;

      const hue = Math.random() * 0.3 + 0.6;
      const color = new THREE.Color().setHSL(hue, 1, 0.5);
      nebulaColors[i * 3] = color.r;
      nebulaColors[i * 3 + 1] = color.g;
      nebulaColors[i * 3 + 2] = color.b;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    nebula.userData.isPoints = true; // Mark as Points
    nebula.userData.flowSpeed = 0.008;
    return nebula;
  }
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
 * Animate star field (works for both InstancedMesh and Points)
 * @param {THREE.InstancedMesh|THREE.Points} starField
 * @param {number} deltaTime
 */
export function animateInstancedStarField(starField, deltaTime) {
  if (!starField || !starField.userData.rotationSpeed) return;

  if (starField.userData.isPoints) {
    // Original Points animation (simple rotation)
    starField.rotation.y += starField.userData.rotationSpeed;
  } else {
    // InstancedMesh animation (delta time based)
    starField.rotation.y += starField.userData.rotationSpeed * deltaTime;
  }
}

/**
 * Animate nebula (works for both InstancedMesh and Points)
 * @param {THREE.InstancedMesh|THREE.Points} nebula
 * @param {number} deltaTime
 */
export function animateInstancedNebula(nebula, deltaTime) {
  if (!nebula || !nebula.userData.flowSpeed) return;

  if (nebula.userData.isPoints) {
    // Original Points animation (simple rotation)
    nebula.rotation.y += nebula.userData.flowSpeed;
  } else {
    // InstancedMesh animation (delta time based)
    nebula.rotation.y += nebula.userData.flowSpeed * deltaTime;
  }
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
