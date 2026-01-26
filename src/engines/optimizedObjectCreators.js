// ============================================
// OPTIMIZED COSMIC OBJECT CREATORS
// ============================================
// LOD-aware object creation with configurable geometry detail
// Optimized for performance with reduced polygon counts

import * as THREE from 'three';
import { GEOMETRY_DETAIL } from '../utils/QualityPresets.js';

/**
 * Create optimized object creators with LOD support
 * @param {string} detailLevel - 'low', 'medium', 'high', 'ultra'
 * @param {number} glowIntensity - Emissive intensity multiplier
 * @returns {Array<Function>} Array of object creator functions
 */
export function createOptimizedObjectCreators(detailLevel = 'medium', glowIntensity = 0.8) {
  const detail = GEOMETRY_DETAIL[detailLevel] || GEOMETRY_DETAIL.medium;

  return [
    // 0. Genèse - Poussière cosmique (optimized particle count)
    () => {
      const group = new THREE.Group();
      const particleCount = detailLevel === 'low' ? 6 : detailLevel === 'medium' ? 8 : 12;

      for (let i = 0; i < particleCount; i++) {
        const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.12, ...detail.sphere);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x00ffc8,
          emissive: 0x00ffc8,
          emissiveIntensity: 0.8 * glowIntensity,
          transparent: true,
          opacity: 0.9
        });
        const p = new THREE.Mesh(geo, mat);
        p.position.set(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        );
        group.add(p);
      }
      return group;
    },

    // 1. Nébuleuse (optimized cloud count)
    () => {
      const group = new THREE.Group();
      const cloudCount = detailLevel === 'low' ? 8 : detailLevel === 'medium' ? 10 : 15;

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, ...detail.sphere),
        new THREE.MeshStandardMaterial({
          color: 0x8a2be2,
          emissive: 0x4b0082,
          emissiveIntensity: 1 * glowIntensity,
          transparent: true,
          opacity: 0.7
        })
      );
      group.add(core);

      for (let i = 0; i < cloudCount; i++) {
        const cloud = new THREE.Mesh(
          new THREE.SphereGeometry(0.1 + Math.random() * 0.2, ...detail.sphere),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.8, 0.5),
            emissive: 0x4b0082,
            emissiveIntensity: 0.5 * glowIntensity,
            transparent: true,
            opacity: 0.5
          })
        );
        const angle = Math.random() * Math.PI * 2;
        cloud.position.set(
          Math.cos(angle) * (0.3 + Math.random() * 0.5),
          (Math.random() - 0.5) * 0.6,
          Math.sin(angle) * (0.3 + Math.random() * 0.5)
        );
        group.add(cloud);
      }
      return group;
    },

    // 2. Plasma (optimized filament count)
    () => {
      const group = new THREE.Group();
      const filamentCount = detailLevel === 'low' ? 3 : 5;

      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.5, ...detail.sphere),
        new THREE.MeshStandardMaterial({
          color: 0xff0080,
          emissive: 0xff4400,
          emissiveIntensity: 1.2 * glowIntensity,
          metalness: 0.3,
          roughness: 0.7
        })
      ));

      for (let i = 0; i < filamentCount; i++) {
        const filament = new THREE.Mesh(
          new THREE.TorusGeometry(0.55 + i * 0.08, 0.015, ...detail.torus),
          new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.7 - i * 0.1
          })
        );
        filament.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        group.add(filament);
      }
      return group;
    },

    // 3. Étoile (optimized ray count)
    () => {
      const group = new THREE.Group();
      const rayCount = detailLevel === 'low' ? 4 : 8;

      group.add(new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.4, detail.icosahedron),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffd700,
          emissiveIntensity: 2 * glowIntensity
        })
      ));

      for (let i = 0; i < rayCount; i++) {
        const ray = new THREE.Mesh(
          new THREE.ConeGeometry(0.06, 0.7, detail.cone),
          new THREE.MeshBasicMaterial({
            color: 0xffdd00,
            transparent: true,
            opacity: 0.85
          })
        );
        const theta = (i / rayCount) * Math.PI * 2;
        ray.position.set(Math.cos(theta) * 0.45, 0, Math.sin(theta) * 0.45);
        ray.rotation.z = -Math.PI / 2;
        ray.rotation.y = -theta;
        group.add(ray);
      }

      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.65, ...detail.sphere),
        new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide
        })
      ));
      return group;
    },

    // 4. Cristal
    () => {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({
          color: 0xffc800,
          emissive: 0xffa000,
          emissiveIntensity: 0.6 * glowIntensity,
          metalness: 1,
          roughness: 0,
          transparent: true,
          opacity: 0.9
        })
      ));

      const inner = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.3, 0),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.6,
          wireframe: true
        })
      );
      inner.rotation.y = Math.PI / 4;
      group.add(inner);
      return group;
    },

    // 5. Astéroïde
    () => {
      const group = new THREE.Group();
      const geo = new THREE.DodecahedronGeometry(0.5, detailLevel === 'low' ? 0 : 1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const noise = 0.75 + Math.random() * 0.5;
        pos.setXYZ(i, pos.getX(i) * noise, pos.getY(i) * noise, pos.getZ(i) * noise);
      }
      geo.computeVertexNormals();
      group.add(new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: 0x8b7765,
          roughness: 1,
          metalness: 0.2,
          flatShading: true
        })
      ));
      return group;
    },

    // 6. Méduse (optimized tentacle count)
    () => {
      const group = new THREE.Group();
      const tentacleCount = detailLevel === 'low' ? 4 : 8;

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, ...detail.sphere, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: 0x00c8ff,
          emissive: 0x0066ff,
          emissiveIntensity: 0.6 * glowIntensity,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide
        })
      );
      dome.rotation.x = Math.PI;
      group.add(dome);

      for (let i = 0; i < tentacleCount; i++) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3((Math.random() - 0.5) * 0.3, -0.3, (Math.random() - 0.5) * 0.3),
          new THREE.Vector3((Math.random() - 0.5) * 0.5, -0.7, (Math.random() - 0.5) * 0.5),
          new THREE.Vector3((Math.random() - 0.5) * 0.4, -1.1, (Math.random() - 0.5) * 0.4)
        ]);
        const tentacle = new THREE.Mesh(
          new THREE.TubeGeometry(curve, ...detail.tube, 0.02, false),
          new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.65
          })
        );
        const angle = (i / tentacleCount) * Math.PI * 2;
        tentacle.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
        group.add(tentacle);
      }
      return group;
    },

    // 7. Aurora (optimized points)
    () => {
      const group = new THREE.Group();
      const pointCount = detailLevel === 'low' ? 10 : 20;
      const particleCount = detailLevel === 'low' ? 6 : 12;

      const points = [];
      for (let i = 0; i < pointCount; i++) {
        points.push(new THREE.Vector3(
          Math.sin(i * 0.5) * 0.3,
          i * (2 / pointCount) - 1,
          Math.cos(i * 0.5) * 0.3
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      group.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, pointCount * 2, 0.07, ...detail.tube.slice(1), false),
        new THREE.MeshBasicMaterial({
          color: 0x00ff7f,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        })
      ));

      for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, ...detail.sphere),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.3 + Math.random() * 0.4, 1, 0.6),
            transparent: true,
            opacity: 0.85
          })
        );
        p.position.copy(curve.getPoint(Math.random()));
        group.add(p);
      }
      return group;
    },

    // 8. Vortex (optimized rings)
    () => {
      const group = new THREE.Group();
      const ringCount = detailLevel === 'low' ? 2 : 3;

      group.add(new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.28, 0.08, ...detail.torusKnot, 2, 3),
        new THREE.MeshStandardMaterial({
          color: 0xff00ff,
          emissive: 0xff00ff,
          emissiveIntensity: 0.9 * glowIntensity,
          metalness: 0.5,
          roughness: 0.3
        })
      ));

      for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.45 + i * 0.12, 0.012, ...detail.torus),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i * 0.3, 1, 0.5),
            transparent: true,
            opacity: 0.55 - i * 0.15
          })
        );
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
      }
      return group;
    },

    // 9. Glitch (optimized fragments)
    () => {
      const group = new THREE.Group();
      const fragmentCount = detailLevel === 'low' ? 3 : 6;

      group.add(new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 0.55),
        new THREE.MeshNormalMaterial({ flatShading: true })
      ));

      for (let i = 0; i < fragmentCount; i++) {
        const frag = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.18, 0.18),
          new THREE.MeshBasicMaterial({
            color: [0xff0000, 0x00ff00, 0x0000ff][i % 3],
            transparent: true,
            opacity: 0.6,
            wireframe: Math.random() > 0.5
          })
        );
        frag.position.set(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7
        );
        group.add(frag);
      }
      return group;
    },

    // 10. Singularité
    () => {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.25, ...detail.sphere),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      ));

      const disk = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.12, ...detail.torus),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        })
      );
      disk.rotation.x = Math.PI / 2;
      group.add(disk);

      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.75, ...detail.sphere),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        })
      ));
      return group;
    }
  ];
}

export default createOptimizedObjectCreators;
