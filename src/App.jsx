import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Critical components - loaded immediately
import CustomCursor from './components/CustomCursor.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import SectionIndicator from './components/SectionIndicator.jsx';
import UniverseName from './components/UniverseName.jsx';
import ChapterNumber from './components/ChapterNumber.jsx';
import ObjectCounter from './components/ObjectCounter.jsx';
import Instructions from './components/Instructions.jsx';
import Section from './components/Section.jsx';
import Card from './components/Card.jsx';
import LoadingFallback from './components/LoadingFallback.jsx';

// Non-critical components - lazy loaded
const ControlPanel = lazy(() => import('./components/ControlPanel.jsx'));
const ModeIndicator = lazy(() => import('./components/ModeIndicator.jsx'));
const AudioVisualizer = lazy(() => import('./components/AudioVisualizer.jsx'));
const VolumeControl = lazy(() => import('./components/VolumeControl.jsx'));
const Radar = lazy(() => import('./components/Radar.jsx'));
const DebugPanel = lazy(() => import('./components/DebugPanel.jsx'));

// Import engines
import CosmicAudioEngine from './engines/audioEngine.js';
import CosmicRadar from './engines/radarEngine.js';
import objectCreators from './engines/objectCreators.js';

// Import debug manager
import debugManager from './utils/DebugManager.js';

// Import data
import { universeData } from './data/universes.js';

// Import post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader, ChromaticAberrationShader, FilmGrainShader } from './shaders/postProcessingShaders.js';

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
  const [physicsLoaded, setPhysicsLoaded] = useState(false);
  const [isLoadingPhysics, setIsLoadingPhysics] = useState(false);
  const [debugPanelVisible, setDebugPanelVisible] = useState(false);
  const [postProcessingEnabled, setPostProcessingEnabled] = useState(true);

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

  // Refs for post-processing
  const composerRef = useRef(null);
  const bloomPassRef = useRef(null);
  const chromaticAberrationPassRef = useRef(null);
  const filmGrainPassRef = useRef(null);
  const vignettePassRef = useRef(null);

  // Refs for engines and interaction
  const RAPIERRef = useRef(null);
  const groundBodyCreatedRef = useRef(false);
  const isCreatingBodyRef = useRef(false); // Prevent concurrent access to Rapier world
  const audioEngineRef = useRef(null);
  const radarRef = useRef(null);
  const radarInitializedRef = useRef(false);
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

  // Update post-processing effects based on universe
  const updatePostProcessingForUniverse = (section) => {
    if (!postProcessingEnabled || !bloomPassRef.current || !chromaticAberrationPassRef.current) return;

    // Universe-specific post-processing profiles
    const profiles = [
      // 0: Genesis - Intense bloom, minimal aberration (purity, birth)
      { bloom: 1.5, aberration: 0.001, grain: 0.08 },
      // 1: Nebula - High bloom, moderate aberration (cosmic clouds)
      { bloom: 1.3, aberration: 0.0015, grain: 0.12 },
      // 2: Plasma - Maximum bloom, high aberration (energy)
      { bloom: 1.8, aberration: 0.002, grain: 0.1 },
      // 3: Stellar Forge - Strong bloom (bright stars)
      { bloom: 1.6, aberration: 0.0012, grain: 0.11 },
      // 4: Fractal - Moderate effects (geometric clarity)
      { bloom: 1.0, aberration: 0.001, grain: 0.09 },
      // 5: Asteroids - Reduced bloom (dark rocks)
      { bloom: 0.8, aberration: 0.0008, grain: 0.15 },
      // 6: Cosmic Ocean - Flowing bloom (liquid light)
      { bloom: 1.2, aberration: 0.0018, grain: 0.1 },
      // 7: Aurora - High bloom, subtle aberration (magnetic dance)
      { bloom: 1.4, aberration: 0.0013, grain: 0.08 },
      // 8: Vortex - Maximum aberration (distortion)
      { bloom: 1.1, aberration: 0.0025, grain: 0.12 },
      // 9: Glitch - Extreme aberration (quantum anomaly)
      { bloom: 0.9, aberration: 0.003, grain: 0.18 },
      // 10: Singularity - Inverted bloom, max aberration (black hole)
      { bloom: 0.6, aberration: 0.0035, grain: 0.2 }
    ];

    const profile = profiles[section];

    // Animate transitions
    gsap.to(bloomPassRef.current, {
      strength: profile.bloom,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    gsap.to(chromaticAberrationPassRef.current.uniforms.amount, {
      value: profile.aberration,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    if (filmGrainPassRef.current) {
      gsap.to(filmGrainPassRef.current.uniforms.intensity, {
        value: profile.grain,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  };

  // Update UI based on current section
  const updateUI = (section) => {
    setCurrentSection(section);
    document.documentElement.style.setProperty('--universe-color', universeData[section].color);
    if (radarRef.current) {
      radarRef.current.setColor(universeData[section].color);
    }
    updatePostProcessingForUniverse(section);
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
  const spawnObject = async (x, y) => {
    if (!sceneRef.current) return;

    // Prevent concurrent access to Rapier world
    if (isCreatingBodyRef.current) {
      debugManager.log('Physics', 'Spawn blocked - already creating body');
      return;
    }

    isCreatingBodyRef.current = true;

    try {
      // Load physics on first object creation (lazy loading)
      if (!RAPIERRef.current) {
        const RAPIER = await loadPhysics();
        if (!RAPIER) {
          isCreatingBodyRef.current = false;
          return; // Failed to load
        }

        // Initialize physics world
        const world = new RAPIER.World({ x: 0, y: gravityInverted ? 9.81 : -9.81, z: 0 });
        worldRef.current = world;

        // Create ground body (only once)
        const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -2, 0));
        world.createCollider(RAPIER.ColliderDesc.cuboid(25, 0.5, 25), groundBody);
        groundBodyCreatedRef.current = true;
      }

      if (!worldRef.current) {
        isCreatingBodyRef.current = false;
        return;
      }

      const cosmicObject = objectCreators[currentSection]();
      sceneRef.current.add(cosmicObject);

      const mouseXNorm = (x / window.innerWidth) * 2 - 1;
      const mouseYNorm = -(y / window.innerHeight) * 2 + 1;
      const spawnX = mouseXNorm * 12;
      const spawnZ = mouseYNorm * 8;

      const RAPIER = RAPIERRef.current;
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
    } finally {
      // Always release the lock
      isCreatingBodyRef.current = false;
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

    // Don't clear while creating a body
    if (isCreatingBodyRef.current) {
      debugManager.log('Physics', 'Clear blocked - currently creating body');
      return;
    }

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
    // Basic checks - only scene, camera, and renderer are required
    // Physics (worldRef) is optional and loaded lazily
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    debugManager.countFrame();

    const dt = timeWarpRef.current ? 0.004 : 0.016;
    timeRef.current += dt;

    // Only step physics if loaded AND not currently creating a body
    if (worldRef.current && !isCreatingBodyRef.current) {
      worldRef.current.step();
    }

    // Attract mode - only if physics loaded and not creating body
    if (attractModeRef.current && worldRef.current && !isCreatingBodyRef.current && bodiesRef.current.length > 0) {
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

    // Update physics bodies - only if physics loaded and not creating body
    if (worldRef.current && !isCreatingBodyRef.current && bodiesRef.current.length > 0) {
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
    }

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

    // Update radar - only if physics loaded and not creating body (needs bodies)
    if (radarVisibleRef.current && radarRef.current && worldRef.current && !isCreatingBodyRef.current) {
      radarRef.current.update(bodiesRef.current, Date.now());
      radarRef.current.draw();
    }

    cameraRef.current.lookAt(0, 3, 0);

    // Use post-processing composer if enabled, otherwise direct render
    if (postProcessingEnabled && composerRef.current) {
      // Update film grain time
      if (filmGrainPassRef.current) {
        filmGrainPassRef.current.uniforms.time.value = timeRef.current;
      }
      composerRef.current.render();
    } else {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Initialize Three.js scene and physics
  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
        debugManager.log('Init', 'Starting application initialization');

        // Note: RAPIER will be loaded on demand (first click)
        // This speeds up initial page load by ~2MB!

        // Three.js setup
        debugManager.log('Init', 'Creating Three.js scene');
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
          debugManager.log('Init', 'Renderer attached to DOM', {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: renderer.getPixelRatio()
          });
        } else {
          debugManager.error('Init', 'Canvas ref is null!', new Error('canvasRef.current is null'));
        }
        rendererRef.current = renderer;

        // Post-processing setup
        debugManager.log('Init', 'Setting up post-processing...');
        const composer = new EffectComposer(renderer);

        // 1. Render Pass (base scene)
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // 2. Bloom Pass (glowing effects)
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.2,    // strength
          0.4,    // radius
          0.3     // threshold (ABAISSÉ de 0.85 à 0.3 pour scène plus lumineuse)
        );
        composer.addPass(bloomPass);
        bloomPassRef.current = bloomPass;

        // 3. Chromatic Aberration Pass
        const chromaticAberrationPass = new ShaderPass(ChromaticAberrationShader);
        chromaticAberrationPass.uniforms.amount.value = 0.0015;
        composer.addPass(chromaticAberrationPass);
        chromaticAberrationPassRef.current = chromaticAberrationPass;

        // 4. Film Grain Pass
        const filmGrainPass = new ShaderPass(FilmGrainShader);
        filmGrainPass.uniforms.intensity.value = 0.03; // RÉDUIT de 0.12 à 0.03 pour grain subtil
        composer.addPass(filmGrainPass);
        filmGrainPassRef.current = filmGrainPass;

        // 5. Vignette Pass
        const vignettePass = new ShaderPass(VignetteShader);
        vignettePass.uniforms.offset.value = 0.95;
        vignettePass.uniforms.darkness.value = 1.2; // RÉDUIT de 1.6 à 1.2 pour bords moins sombres
        composer.addPass(vignettePass);
        vignettePassRef.current = vignettePass;

        composerRef.current = composer;
        debugManager.log('Init', 'Post-processing initialized', {
          passes: ['Render', 'Bloom', 'ChromaticAberration', 'FilmGrain', 'Vignette']
        });

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

        // Note: Ground physics body will be created when physics engine loads (on first click)

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
        debugManager.log('Audio', 'Initializing audio engine...');
        const audioEngine = new CosmicAudioEngine();
        await audioEngine.init();
        audioEngineRef.current = audioEngine;
        debugManager.updatePerformance({ audioLoaded: true });
        debugManager.log('Audio', 'Audio engine initialized');

        // Note: Radar will be initialized on first activation (lazy loading)

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
          onStart: () => { if (!gravityInverted && worldRef.current) worldRef.current.gravity = { x: 0, y: -2, z: 0 }; },
          onReverseComplete: () => { if (!gravityInverted && worldRef.current) worldRef.current.gravity = { x: 0, y: -9.81, z: 0 }; }
        }, sectionDuration * 6);

        mainTimeline.to({}, {
          duration: 0.01,
          onStart: () => { if (!gravityInverted && worldRef.current) worldRef.current.gravity = { x: 0, y: -9.81, z: 0 }; }
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

          // Update composer size
          if (composer) {
            composer.setSize(window.innerWidth, window.innerHeight);
          }
        };

        window.addEventListener('resize', handleResize);

        // Start animation loop
        if (isMounted) {
          animate();
          debugManager.log('Init', 'Application initialized successfully', {
            scene: !!scene,
            camera: !!camera,
            renderer: !!renderer,
            universes: universeData.length
          });
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
        debugManager.error('Init', 'Application initialization failed', error);
      }
    };

    initApp();
  }, []); // Only run once on mount

  // Track object count changes
  useEffect(() => {
    debugManager.updatePerformance({ objectCount });
  }, [objectCount]);

  // Keyboard shortcut for debug panel (Ctrl+D or Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDebugPanelVisible(prev => !prev);
        debugManager.log('Debug', `Debug panel ${!debugPanelVisible ? 'opened' : 'closed'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugPanelVisible]);

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

    // Initialize radar on first activation (lazy loading)
    if (radarVisible && !radarInitializedRef.current) {
      debugManager.log('Radar', 'Initializing radar...');
      // Wait a bit for the lazy-loaded Radar component to mount
      setTimeout(() => {
        const radarCanvas = document.getElementById('radarCanvas');
        if (radarCanvas && !radarRef.current) {
          const radar = new CosmicRadar('radarCanvas');
          radar.setColor(universeData[currentSection].color);
          radarRef.current = radar;
          radarInitializedRef.current = true;
          debugManager.updatePerformance({ radarLoaded: true });
          debugManager.log('Radar', 'Radar initialized successfully');
        }
      }, 100);
    }
  }, [radarVisible, currentSection]);

  // Load physics engine dynamically (lazy loading)
  const loadPhysics = async () => {
    if (RAPIERRef.current) return RAPIERRef.current;

    if (isLoadingPhysics) {
      // Wait for current loading to finish
      while (!RAPIERRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return RAPIERRef.current;
    }

    setIsLoadingPhysics(true);
    showModeIndicator('CHARGEMENT PHYSIQUE...');
    debugManager.log('Physics', 'Starting physics engine load');

    const startTime = performance.now();

    try {
      const RAPIER = await import('@dimforge/rapier3d-compat');
      await RAPIER.default.init();
      RAPIERRef.current = RAPIER.default;
      setPhysicsLoaded(true);
      setIsLoadingPhysics(false);

      const loadTime = Math.round(performance.now() - startTime);
      debugManager.trackLazyLoad('RAPIER Physics', loadTime);
      debugManager.updatePerformance({ physicsLoaded: true });
      debugManager.log('Physics', `Physics engine loaded in ${loadTime}ms`);

      showModeIndicator('PHYSIQUE ACTIVÉE');
      return RAPIER.default;
    } catch (error) {
      console.error('Failed to load physics engine:', error);
      debugManager.error('Physics', 'Failed to load physics engine', error);
      setIsLoadingPhysics(false);
      showModeIndicator('ERREUR PHYSIQUE');
      return null;
    }
  };

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
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>

      {/* Mode Indicator */}
      <Suspense fallback={<LoadingFallback />}>
        <ModeIndicator text={modeIndicatorText} visible={modeIndicatorVisible} />
      </Suspense>

      {/* Radar */}
      <Suspense fallback={<LoadingFallback />}>
        <Radar visible={radarVisible} />
      </Suspense>

      {/* Audio Controls Container */}
      <div className={`audio-controls-container ${audioPlaying ? 'visible' : ''}`}>
        {/* Audio Visualizer */}
        <Suspense fallback={<LoadingFallback />}>
          <AudioVisualizer
            playing={audioPlaying}
            analyser={audioEngineRef.current?.analyser || null}
          />
        </Suspense>

        {/* Volume Control */}
        <Suspense fallback={<LoadingFallback />}>
          <VolumeControl
            visible={audioPlaying}
            onVolumeChange={(value) => {
              if (audioEngineRef.current) {
                audioEngineRef.current.setVolume(value / 100);
              }
            }}
          />
        </Suspense>
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

      {/* Debug Panel (Ctrl+D / Cmd+D to toggle) */}
      <Suspense fallback={null}>
        <DebugPanel visible={debugPanelVisible} />
      </Suspense>
    </>
  );
}

export default App;
