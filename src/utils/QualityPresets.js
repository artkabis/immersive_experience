// ============================================
// QUALITY PRESETS SYSTEM
// ============================================
// Professional quality management for WebGL performance

export const QUALITY_PRESETS = {
  original: {
    name: 'Original',
    description: 'Configuration v2.0.0 (avant optimisations)',
    quality: {
      preset: 'original',
      autoAdjust: false
    },
    lighting: {
      ambientIntensity: 0.3,
      mainLightIntensity: 300,
      secondaryLightIntensity: 150,
      glowIntensity: 0.8
    },
    postProcessing: {
      enabled: true,
      bloomStrength: 0.9,
      bloomThreshold: 0.15,
      bloomRadius: 0.4,
      chromaticAberration: 0.0015,
      vignetteIntensity: 0.8
    },
    performance: {
      maxObjects: 200,              // Pas de limite stricte avant
      starCount: 5000,               // Original
      nebulaCount: 800,              // Original
      targetFPS: 60,
      showFPS: true,
      geometryDetail: 'ultra',       // Géométries originales complexes
      enableShadows: false,
      useInstancing: false,          // DÉSACTIVÉ - utilise Points comme avant
      enableObjectPooling: false     // DÉSACTIVÉ - pas d'optimisation
    }
  },

  low: {
    name: 'Low',
    description: 'Performance optimale (60+ FPS)',
    quality: {
      preset: 'low',
      autoAdjust: false
    },
    lighting: {
      ambientIntensity: 0.25,
      mainLightIntensity: 250,
      secondaryLightIntensity: 120,
      glowIntensity: 0.6
    },
    postProcessing: {
      enabled: false,
      bloomStrength: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
      chromaticAberration: 0,
      vignetteIntensity: 0
    },
    performance: {
      maxObjects: 25,
      starCount: 1000,
      nebulaCount: 100,
      targetFPS: 60,
      showFPS: true,
      geometryDetail: 'low',        // 8x8 segments
      enableShadows: false,
      useInstancing: true,
      enableObjectPooling: true
    }
  },

  medium: {
    name: 'Medium',
    description: 'Équilibre performance/qualité',
    quality: {
      preset: 'medium',
      autoAdjust: false
    },
    lighting: {
      ambientIntensity: 0.3,
      mainLightIntensity: 300,
      secondaryLightIntensity: 150,
      glowIntensity: 0.8
    },
    postProcessing: {
      enabled: true,
      bloomStrength: 0.9,
      bloomThreshold: 0.15,
      bloomRadius: 0.4,
      chromaticAberration: 0.0015,
      vignetteIntensity: 0.8
    },
    performance: {
      maxObjects: 50,
      starCount: 2000,
      nebulaCount: 300,
      targetFPS: 60,
      showFPS: true,
      geometryDetail: 'medium',     // 12x12 segments
      enableShadows: false,
      useInstancing: true,
      enableObjectPooling: true
    }
  },

  high: {
    name: 'High',
    description: 'Haute qualité visuelle',
    quality: {
      preset: 'high',
      autoAdjust: false
    },
    lighting: {
      ambientIntensity: 0.35,
      mainLightIntensity: 350,
      secondaryLightIntensity: 175,
      glowIntensity: 1.0
    },
    postProcessing: {
      enabled: true,
      bloomStrength: 1.2,
      bloomThreshold: 0.1,
      bloomRadius: 0.5,
      chromaticAberration: 0.002,
      vignetteIntensity: 1.0
    },
    performance: {
      maxObjects: 75,
      starCount: 3000,
      nebulaCount: 500,
      targetFPS: 60,
      showFPS: true,
      geometryDetail: 'high',       // 16x16 segments
      enableShadows: false,
      useInstancing: true,
      enableObjectPooling: true
    }
  },

  ultra: {
    name: 'Ultra',
    description: 'Qualité maximale (GPU puissant)',
    quality: {
      preset: 'ultra',
      autoAdjust: false
    },
    lighting: {
      ambientIntensity: 0.4,
      mainLightIntensity: 400,
      secondaryLightIntensity: 200,
      glowIntensity: 1.2
    },
    postProcessing: {
      enabled: true,
      bloomStrength: 1.5,
      bloomThreshold: 0.05,
      bloomRadius: 0.6,
      chromaticAberration: 0.0025,
      vignetteIntensity: 1.2
    },
    performance: {
      maxObjects: 100,
      starCount: 5000,
      nebulaCount: 800,
      targetFPS: 60,
      showFPS: true,
      geometryDetail: 'ultra',      // 24x24 segments
      enableShadows: true,
      useInstancing: true,
      enableObjectPooling: true
    }
  }
};

// Geometry detail levels (LOD)
export const GEOMETRY_DETAIL = {
  low: {
    sphere: [8, 8],
    torus: [8, 16],
    torusKnot: [32, 4],
    tube: [10, 4],
    icosahedron: 0,
    cone: 4
  },
  medium: {
    sphere: [12, 12],
    torus: [12, 24],
    torusKnot: [48, 6],
    tube: [20, 6],
    icosahedron: 1,
    cone: 6
  },
  high: {
    sphere: [16, 16],
    torus: [16, 32],
    torusKnot: [56, 7],
    tube: [30, 8],
    icosahedron: 2,
    cone: 8
  },
  ultra: {
    sphere: [24, 24],
    torus: [20, 48],
    torusKnot: [64, 8],
    tube: [40, 10],
    icosahedron: 2,
    cone: 10
  }
};

/**
 * Get default settings based on user's device capabilities
 * @returns {string} Preset name ('low', 'medium', 'high', 'ultra')
 */
export function detectOptimalPreset() {
  // Check GPU tier
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) return 'low';

  // Get GPU info
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check memory (if available)
  const memory = navigator.deviceMemory || 4;

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) return 'low';

  // GPU tier detection (simple heuristic)
  if (renderer.includes('RTX') || renderer.includes('RX 6') || renderer.includes('RX 7')) {
    return memory >= 8 && cores >= 8 ? 'ultra' : 'high';
  }

  if (renderer.includes('GTX') || renderer.includes('RX 5')) {
    return memory >= 6 && cores >= 6 ? 'high' : 'medium';
  }

  // Default fallback based on cores and memory
  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4 && memory >= 4) return 'medium';

  return 'low';
}

/**
 * Apply a quality preset to settings
 * @param {string} presetName - Name of the preset
 * @returns {Object} Settings object
 */
export function applyPreset(presetName) {
  const preset = QUALITY_PRESETS[presetName];
  if (!preset) {
    console.warn(`Preset "${presetName}" not found, falling back to "medium"`);
    return QUALITY_PRESETS.medium;
  }
  return JSON.parse(JSON.stringify(preset)); // Deep clone
}

/**
 * Save settings to localStorage
 * @param {Object} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem('odyssee-cosmique-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

/**
 * Load settings from localStorage
 * @returns {Object|null} Settings object or null if not found
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem('odyssee-cosmique-settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return null;
}

/**
 * Get initial settings (from localStorage or auto-detect)
 * @returns {Object} Settings object
 */
export function getInitialSettings() {
  const stored = loadSettings();
  if (stored) return stored;

  // Auto-detect optimal preset
  const optimalPreset = detectOptimalPreset();
  console.log(`Auto-detected optimal preset: ${optimalPreset}`);

  return applyPreset(optimalPreset);
}
