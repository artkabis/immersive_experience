import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RAPIER from '@dimforge/rapier3d-compat';

// Import all components
import CustomCursor from './components/CustomCursor.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import SectionIndicator from './components/SectionIndicator.jsx';
import UniverseName from './components/UniverseName.jsx';
import ChapterNumber from './components/ChapterNumber.jsx';
import ObjectCounter from './components/ObjectCounter.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import ModeIndicator from './components/ModeIndicator.jsx';
import AudioVisualizer from './components/AudioVisualizer.jsx';
import VolumeControl from './components/VolumeControl.jsx';
import Radar from './components/Radar.jsx';
import Instructions from './components/Instructions.jsx';
import Section from './components/Section.jsx';
import Card from './components/Card.jsx';

// Import engines
import CosmicAudioEngine from './engines/audioEngine.js';
import CosmicRadar from './engines/radarEngine.js';
import objectCreators from './engines/objectCreators.js';

// Import data
import { universeData } from './data/universes.js';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // State management
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [objectCount, setObjectCount] = useState(0);
  const [gravityInverted, setGravityInverted] = useState(false);
  const [attractMode, setAttractMode] = useState(false);
  const [timeWarp, setTimeWarp] = useState(false);
  const [radarVisible, setRadarVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [modeIndicatorText, setModeIndicatorText] = useState('');
  const [modeIndicatorVisible, setModeIndicatorVisible] = useState(false);

  // Refs for Three.js and physics
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const worldRef = useRef(null);
  const bodiesRef = useRef([]);
  const mainLightRef = useRef(null);
  const secondaryLightRef = useRef(null);
  const tertiaryLightRef = useRef(null);
  const gridGroupRef = useRef(null);
  const gridLinesRef = useRef(null);
  const centerLineXRef = useRef(null);
  const centerLineZRef = useRef(null);
  const intersectionPointsRef = useRef(null);
  const glowPlaneRef = useRef(null);
  const starFieldRef = useRef(null);
  const nebulaRef = useRef(null);
  const ringsRef = useRef([]);

  // Refs for engines and interaction
  const audioEngineRef = useRef(null);
  const radarRef = useRef(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const spawnIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);

  // Refs for animation loop state (avoid closure issues)
  const timeWarpRef = useRef(false);
  const attractModeRef = useRef(false);
  const radarVisibleRef = useRef(false);

  // Show mode indicator
  const showModeIndicator = (text) => {
    setModeIndicatorText(text);
    setModeIndicatorVisible(true);
    setTimeout(() => setModeIndicatorVisible(false), 1500);
  };

  // Update UI based on current section
  const updateUI = (section) => {
    setCurrentSection(section);
    document.documentElement.style.setProperty('--universe-color', universeData[section].color);
    if (radarRef.current) {
      radarRef.current.setColor(universeData[section].color);
    }
  };

  // Update grid color
  const updateGridColor = (section) => {
    const color = new THREE.Color(universeData[section].color);
    if (gridLinesRef.current) {
      gridLinesRef.current.children.forEach(line => {
        line.material.color = color;
      });
    }
    if (centerLineXRef.current) centerLineXRef.current.material.color = color;
    if (centerLineZRef.current) centerLineZRef.current.material.color = color;
    if (intersectionPointsRef.current) intersectionPointsRef.current.material.color = color;
    if (glowPlaneRef.current) glowPlaneRef.current.material.color = color;
  };

  // Create click ripple effect
  const createClickRipple = (x, y) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  };

  // Spawn cosmic object
  const spawnObject = (x, y) => {
    if (!sceneRef.current || !worldRef.current) return;

    const cosmicObject = objectCreators[currentSection]();
    sceneRef.current.add(cosmicObject);

    const mouseXNorm = (x / window.innerWidth) * 2 - 1;
    const mouseYNorm = -(y / window.innerHeight) * 2 + 1;
    const spawnX = mouseXNorm * 12;
    const spawnZ = mouseYNorm * 8;

    const body = worldRef.current.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(spawnX, 25, spawnZ)
        .setAngvel({ x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3, z: (Math.random() - 0.5) * 3 })
    );

    worldRef.current.createCollider(RAPIER.ColliderDesc.ball(0.5), body);

    bodiesRef.current.push({
      mesh: cosmicObject,
      body,
      type: currentSection,
      birthTime: Date.now()
    });

    gsap.from(cosmicObject.scale, {
      x: 0, y: 0, z: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)"
    });

    setObjectCount(bodiesRef.current.length);
    createClickRipple(x, y);

    if (audioEngineRef.current && audioPlaying) {
      audioEngineRef.current.playSpawnSound(currentSection);
    }
  };

  // Trigger Big Bang
  const triggerBigBang = () => {
    if (!worldRef.current) return;

    worldRef.current.gravity = { x: 0, y: 20, z: 0 };

    if (audioEngineRef.current && audioPlaying) {
      audioEngineRef.current.playBigBang();
    }

    bodiesRef.current.forEach((b) => {
      const pos = b.body.translation();
      b.body.applyImpulse({
        x: pos.x * 30 + (Math.random() - 0.5) * 50,
        y: 200 + Math.random() * 100,
        z: pos.z * 30 + (Math.random() - 0.5) * 50
      }, true);
      gsap.to(b.mesh.scale, {
        x: 3, y: 3, z: 3,
        duration: 0.3,
        yoyo: true,
        repeat: 5
      });
    });
  };

  // Reset gravity
  const resetGravity = () => {
    if (!worldRef.current) return;
    worldRef.current.gravity = { x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 };
  };

  // Clear all objects
  const clearAllObjects = () => {
    if (!sceneRef.current || !worldRef.current) return;

    bodiesRef.current.forEach(b => {
      sceneRef.current.remove(b.mesh);
      worldRef.current.removeRigidBody(b.body);
    });
    bodiesRef.current = [];
    setObjectCount(0);
    showModeIndicator('TOUT EFFACÉ');
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (!audioEngineRef.current) return;

    if (audioEngineRef.current.isPlaying) {
      audioEngineRef.current.stop();
      setAudioPlaying(false);
      showModeIndicator('AUDIO DÉSACTIVÉ');
    } else {
      await audioEngineRef.current.start();
      setAudioPlaying(true);
      showModeIndicator('AUDIO ACTIVÉ');
    }
  };

  // Handle section navigation
  const handleSectionClick = (section) => {
    const totalSections = 11;
    const targetScroll = section * (document.body.scrollHeight - window.innerHeight) / (totalSections - 1);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Animation loop
  const animate = () => {
    if (!worldRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const dt = timeWarpRef.current ? 0.004 : 0.016;
    timeRef.current += dt;

    worldRef.current.step();

    // Attract mode
    if (attractModeRef.current) {
      const attractPoint = new THREE.Vector3(
        (mouseXRef.current / window.innerWidth) * 2 - 1,
        0,
        -(mouseYRef.current / window.innerHeight) * 2 + 1
      ).multiplyScalar(10);

      bodiesRef.current.forEach(b => {
        const pos = b.body.translation();
        b.body.applyImpulse({
          x: (attractPoint.x - pos.x) * 0.5,
          y: 0,
          z: (attractPoint.z - pos.z) * 0.5
        }, true);
      });
    }

    // Update physics bodies
    bodiesRef.current.forEach((b, index) => {
      const p = b.body.translation();
      const r = b.body.rotation();
      b.mesh.position.set(p.x, p.y, p.z);
      b.mesh.quaternion.set(r.x, r.y, r.z, r.w);

      // Type-specific animations
      if (b.type === 0) {
        b.mesh.children.forEach((c, i) => {
          if (c.material) c.material.opacity = 0.6 + Math.sin(timeRef.current * 5 + i) * 0.3;
        });
      }
      if (b.type === 1) b.mesh.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.15);
      if (b.type === 2) {
        b.mesh.children.forEach((c, i) => {
          if (i > 0) c.rotation.z = timeRef.current * (2 + i * 0.5);
        });
      }
      if (b.type === 3) b.mesh.rotation.y = timeRef.current * 0.5;
      if (b.type === 4 && b.mesh.children[1]) {
        b.mesh.children[1].rotation.y = timeRef.current * 2;
      }
      if (b.type === 6) {
        b.mesh.children.forEach((c, i) => {
          if (i > 0 && i < 9) c.rotation.x = Math.sin(timeRef.current * 3 + i) * 0.2;
        });
        b.mesh.position.y += Math.sin(timeRef.current * 2 + index) * 0.008;
      }
      if (b.type === 7) b.mesh.rotation.y = timeRef.current * 0.5;
      if (b.type === 8) {
        b.mesh.rotation.y = timeRef.current * 3;
        b.mesh.rotation.x = Math.sin(timeRef.current) * 0.5;
      }
      if (b.type === 9 && Math.random() < 0.03) {
        b.mesh.children.forEach(c => {
          c.position.x += (Math.random() - 0.5) * 0.15;
        });
      }
      if (b.type === 10) {
        if (b.mesh.children[1]) b.mesh.children[1].rotation.z = timeRef.current * 2;
        if (b.mesh.children[2]) b.mesh.children[2].scale.setScalar(1 + Math.sin(timeRef.current * 3) * 0.2);
      }

      // Remove objects that fell off or went too high
      if (p.y < -30 || p.y > 50) {
        sceneRef.current.remove(b.mesh);
        worldRef.current.removeRigidBody(b.body);
        bodiesRef.current.splice(index, 1);
        setObjectCount(bodiesRef.current.length);
      }
    });

    // Background animations
    if (starFieldRef.current) starFieldRef.current.rotation.y = timeRef.current * 0.015;
    if (nebulaRef.current) nebulaRef.current.rotation.y = timeRef.current * 0.008;
    ringsRef.current.forEach((ring, i) => {
      ring.rotation.z = timeRef.current * (0.08 + i * 0.03);
    });

    // Glitch effect on grid
    if (currentSection === 9 && gridGroupRef.current) {
      gridGroupRef.current.position.x = Math.sin(timeRef.current * 20) * 0.2;
      gridGroupRef.current.position.z = Math.cos(timeRef.current * 15) * 0.2;
    } else if (gridGroupRef.current) {
      gridGroupRef.current.position.x *= 0.9;
      gridGroupRef.current.position.z *= 0.9;
    }

    // Update radar
    if (radarVisibleRef.current && radarRef.current) {
      radarRef.current.update(bodiesRef.current, Date.now());
      radarRef.current.draw();
    }

    cameraRef.current.lookAt(0, 3, 0);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Initialize Three.js scene and physics
  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
        // Initialize RAPIER
        await RAPIER.init();
        const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
        worldRef.current = world;

        // Three.js setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.012);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 18);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;

        if (canvasRef.current) {
          canvasRef.current.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        // Lights
        const mainLight = new THREE.PointLight(0x00ffc8, 300);
        mainLight.position.set(5, 15, 5);
        scene.add(mainLight);
        mainLightRef.current = mainLight;

        const secondaryLight = new THREE.PointLight(0x8a2be2, 150);
        secondaryLight.position.set(-8, 8, -8);
        scene.add(secondaryLight);
        secondaryLightRef.current = secondaryLight;

        const tertiaryLight = new THREE.PointLight(0xff0080, 100);
        tertiaryLight.position.set(0, -5, 10);
        scene.add(tertiaryLight);
        tertiaryLightRef.current = tertiaryLight;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambientLight);

        // Ground physics
        const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -2, 0));
        world.createCollider(RAPIER.ColliderDesc.cuboid(25, 0.5, 25), groundBody);

        // Grid
        const gridGroup = new THREE.Group();
        const gridSize = 60;
        const gridDivisions = 30;

        const groundPlaneGeo = new THREE.PlaneGeometry(gridSize, gridSize);
        const groundPlaneMat = new THREE.MeshStandardMaterial({
          color: 0x000000,
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8
        });
        const groundPlane = new THREE.Mesh(groundPlaneGeo, groundPlaneMat);
        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.position.y = -1.49;
        gridGroup.add(groundPlane);

        const gridMaterial = new THREE.LineBasicMaterial({
          color: 0x00ffc8,
          transparent: true,
          opacity: 0.6
        });

        const gridLines = new THREE.Group();
        const step = gridSize / gridDivisions;

        for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
          const geoX = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(i, 0, -gridSize / 2),
            new THREE.Vector3(i, 0, gridSize / 2)
          ]);
          gridLines.add(new THREE.Line(geoX, gridMaterial.clone()));

          const geoZ = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-gridSize / 2, 0, i),
            new THREE.Vector3(gridSize / 2, 0, i)
          ]);
          gridLines.add(new THREE.Line(geoZ, gridMaterial.clone()));
        }
        gridLines.position.y = -1.48;
        gridGroup.add(gridLines);
        gridLinesRef.current = gridLines;

        const centerLineMat = new THREE.LineBasicMaterial({
          color: 0x00ffc8,
          transparent: true,
          opacity: 1
        });

        const centerX = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, -gridSize / 2),
          new THREE.Vector3(0, 0, gridSize / 2)
        ]);
        const centerLineX = new THREE.Line(centerX, centerLineMat);
        centerLineX.position.y = -1.47;
        gridGroup.add(centerLineX);
        centerLineXRef.current = centerLineX;

        const centerZ = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-gridSize / 2, 0, 0),
          new THREE.Vector3(gridSize / 2, 0, 0)
        ]);
        const centerLineZ = new THREE.Line(centerZ, centerLineMat.clone());
        centerLineZ.position.y = -1.47;
        gridGroup.add(centerLineZ);
        centerLineZRef.current = centerLineZ;

        const intersectionGeo = new THREE.BufferGeometry();
        const intersectionPositions = [];
        for (let x = -gridSize / 2; x <= gridSize / 2; x += step * 2) {
          for (let z = -gridSize / 2; z <= gridSize / 2; z += step * 2) {
            intersectionPositions.push(x, -1.45, z);
          }
        }
        intersectionGeo.setAttribute('position', new THREE.Float32BufferAttribute(intersectionPositions, 3));
        const intersectionMat = new THREE.PointsMaterial({
          color: 0x00ffc8,
          size: 0.15,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        const intersectionPoints = new THREE.Points(intersectionGeo, intersectionMat);
        gridGroup.add(intersectionPoints);
        intersectionPointsRef.current = intersectionPoints;

        const glowGeo = new THREE.PlaneGeometry(gridSize * 0.8, gridSize * 0.8);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0x00ffc8,
          transparent: true,
          opacity: 0.05,
          blending: THREE.AdditiveBlending
        });
        const glowPlane = new THREE.Mesh(glowGeo, glowMat);
        glowPlane.rotation.x = -Math.PI / 2;
        glowPlane.position.y = -1.4;
        gridGroup.add(glowPlane);
        glowPlaneRef.current = glowPlane;

        scene.add(gridGroup);
        gridGroupRef.current = gridGroup;

        // Stars
        const starCount = 5000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
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
        scene.add(starField);
        starFieldRef.current = starField;

        // Nebula
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 800;
        const nebulaPositions = new Float32Array(nebulaCount * 3);
        const nebulaColors = new Float32Array(nebulaCount * 3);

        for (let i = 0; i < nebulaCount; i++) {
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
        scene.add(nebula);
        nebulaRef.current = nebula;

        // Rings
        const rings = [];
        for (let i = 0; i < 5; i++) {
          const ringGeometry = new THREE.TorusGeometry(12 + i * 5, 0.04, 16, 200);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i * 0.15, 0.8, 0.5),
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
          ring.position.y = 8;
          scene.add(ring);
          rings.push(ring);
        }
        ringsRef.current = rings;

        // Initialize audio engine
        const audioEngine = new CosmicAudioEngine();
        await audioEngine.init();
        audioEngineRef.current = audioEngine;

        // Initialize radar
        const radar = new CosmicRadar('radarCanvas');
        radarRef.current = radar;

        // GSAP ScrollTrigger
        const totalSections = 11;
        const sectionDuration = 1 / totalSections;
        let previousSection = 0; // Track previous section locally to avoid closure issues

        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            onUpdate: (self) => {
              const progress = self.progress;
              setScrollProgress(progress);

              const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);
              if (newSection !== previousSection) {
                previousSection = newSection; // Update local tracker
                updateUI(newSection);
                updateGridColor(newSection);
                if (audioEngineRef.current && audioEngineRef.current.isPlaying) {
                  audioEngineRef.current.playUniverseAmbient(newSection);
                }
              }
            }
          }
        });

        const cameraPositions = [
          { x: 0, y: 5, z: 18 }, { x: -10, y: 8, z: 14 }, { x: 5, y: 4, z: 12 },
          { x: 0, y: 12, z: 10 }, { x: -8, y: 15, z: 8 }, { x: 8, y: 6, z: 16 },
          { x: 0, y: 2, z: 20 }, { x: -6, y: 8, z: 15 }, { x: 0, y: 5, z: 12 },
          { x: 5, y: 10, z: 14 }, { x: 0, y: 20, z: 25 }
        ];

        for (let i = 0; i < totalSections - 1; i++) {
          mainTimeline.to(camera.position, { ...cameraPositions[i + 1], duration: sectionDuration }, i * sectionDuration);
        }

        mainTimeline.to({}, {
          duration: 0.01,
          onStart: () => { if (!gravityInverted && world) world.gravity = { x: 0, y: -2, z: 0 }; },
          onReverseComplete: () => { if (!gravityInverted && world) world.gravity = { x: 0, y: -9.81, z: 0 }; }
        }, sectionDuration * 6);

        mainTimeline.to({}, {
          duration: 0.01,
          onStart: () => { if (!gravityInverted && world) world.gravity = { x: 0, y: -9.81, z: 0 }; }
        }, sectionDuration * 7);

        mainTimeline.to({}, {
          duration: 0.01,
          onStart: () => triggerBigBang(),
          onReverseComplete: () => resetGravity()
        }, sectionDuration * 10 + 0.05);

        // Window resize handler
        const handleResize = () => {
          if (!camera || !renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Start animation loop
        if (isMounted) {
          animate();
        }

        // Cleanup function
        return () => {
          isMounted = false;
          window.removeEventListener('resize', handleResize);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (renderer) {
            renderer.dispose();
          }
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };

      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initApp();
  }, []); // Only run once on mount

  // Update gravity when gravityInverted changes
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.gravity = { x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 };
    }
  }, [gravityInverted]);

  // Sync refs with states for animation loop (avoid closure issues)
  useEffect(() => {
    timeWarpRef.current = timeWarp;
  }, [timeWarp]);

  useEffect(() => {
    attractModeRef.current = attractMode;
  }, [attractMode]);

  useEffect(() => {
    radarVisibleRef.current = radarVisible;
  }, [radarVisible]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          triggerBigBang();
          showModeIndicator('BIG BANG !');
          setTimeout(resetGravity, 2000);
          break;
        case 'KeyG':
          setGravityInverted(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'GRAVITÉ INVERSÉE' : 'GRAVITÉ NORMALE');
            return newValue;
          });
          break;
        case 'KeyA':
          setAttractMode(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'MODE ATTRACTION' : 'MODE NORMAL');
            return newValue;
          });
          break;
        case 'KeyT':
          setTimeWarp(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'RALENTI TEMPOREL' : 'TEMPS NORMAL');
            return newValue;
          });
          break;
        case 'KeyR':
          setRadarVisible(prev => !prev);
          break;
        case 'KeyM':
          toggleAudio();
          break;
        case 'KeyC':
          clearAllObjects();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gravityInverted, attractMode, timeWarp, radarVisible, audioPlaying]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
    };

    const handleMouseDown = (e) => {
      if (e.target.closest('.control-btn') ||
          e.target.closest('.indicator-dot') ||
          e.target.closest('.volume-control')) return;

      isMouseDownRef.current = true;
      spawnObject(e.clientX, e.clientY);

      spawnIntervalRef.current = setInterval(() => {
        if (isMouseDownRef.current) {
          spawnObject(mouseXRef.current, mouseYRef.current);
        }
      }, 150);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [currentSection]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor mouseX={mouseXRef.current} mouseY={mouseYRef.current} />

      {/* Three.js Canvas */}
      <div ref={canvasRef} id="webgl-container" />

      {/* Progress Bar */}
      <ProgressBar progress={scrollProgress * 100} />

      {/* Object Counter */}
      <ObjectCounter count={objectCount} />

      {/* Control Panel */}
      <ControlPanel
        gravityInverted={gravityInverted}
        attractMode={attractMode}
        timeWarp={timeWarp}
        radarVisible={radarVisible}
        audioPlaying={audioPlaying}
        onGravityToggle={() => {
          setGravityInverted(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'GRAVITÉ INVERSÉE' : 'GRAVITÉ NORMALE');
            return newValue;
          });
        }}
        onAttractToggle={() => {
          setAttractMode(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'MODE ATTRACTION' : 'MODE NORMAL');
            return newValue;
          });
        }}
        onTimeWarpToggle={() => {
          setTimeWarp(prev => {
            const newValue = !prev;
            showModeIndicator(newValue ? 'RALENTI TEMPOREL' : 'TEMPS NORMAL');
            return newValue;
          });
        }}
        onRadarToggle={() => setRadarVisible(prev => !prev)}
        onAudioToggle={toggleAudio}
        onClear={clearAllObjects}
      />

      {/* Mode Indicator */}
      <ModeIndicator text={modeIndicatorText} visible={modeIndicatorVisible} />

      {/* Radar */}
      <Radar visible={radarVisible} />

      {/* Audio Controls Container */}
      <div className={`audio-controls-container ${audioPlaying ? 'visible' : ''}`}>
        {/* Audio Visualizer */}
        <AudioVisualizer
          playing={audioPlaying}
          analyser={audioEngineRef.current?.analyser || null}
        />

        {/* Volume Control */}
        <VolumeControl
          visible={audioPlaying}
          onVolumeChange={(value) => {
            if (audioEngineRef.current) {
              audioEngineRef.current.setVolume(value / 100);
            }
          }}
        />
      </div>

      {/* Section Indicator */}
      <SectionIndicator
        currentSection={currentSection}
        onSectionClick={handleSectionClick}
      />

      {/* Universe Name */}
      <UniverseName
        name={universeData[currentSection].name}
        color={universeData[currentSection].color}
      />

      {/* Chapter Number */}
      <ChapterNumber number={currentSection + 1} />

      {/* Sections */}
      <div id="ui">
        {universeData.map((universe, index) => (
          <Section
            key={universe.id}
            universe={universe.id}
            align={index % 3 === 0 ? 'flex-start' : index % 3 === 1 ? 'flex-end' : 'center'}
          >
            <Card
              symbol={universe.symbol}
              title={universe.name}
              description={universe.description}
            />
          </Section>
        ))}
      </div>

      {/* Instructions */}
      <Instructions />
    </>
  );
}

export default App;
