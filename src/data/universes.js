export const universeData = [
  {
    id: 'genesis',
    name: 'GENÈSE',
    color: '#00ffc8',
    symbol: '⚛️',
    title: 'Le Début de Tout',
    description: 'Dans le silence infini précédant l\'existence, une fluctuation quantique a déclenché l\'expansion. L\'énergie pure s\'est cristallisée en particules, créant les fondations de notre réalité.'
  },
  {
    id: 'nebula',
    name: 'NÉBULEUSE',
    color: '#8a2be2',
    symbol: '🌌',
    title: 'Nurserie Stellaire',
    description: 'Des nuages de gaz et de poussière cosmiques dansent dans l\'obscurité, bercés par des forces gravitationnelles. Ici naissent les étoiles, dans un ballet de matière et d\'énergie.'
  },
  {
    id: 'plasma',
    name: 'PLASMA',
    color: '#ff0080',
    symbol: '⚡',
    title: 'Matière Incandescente',
    description: 'Au cœur des étoiles, la matière atteint des états extrêmes. Les noyaux fusionnent, libérant une énergie colossale qui illumine les ténèbres cosmiques.'
  },
  {
    id: 'stellar',
    name: 'FORGE STELLAIRE',
    color: '#ffd700',
    symbol: '⭐',
    title: 'L\'Atelier des Éléments',
    description: 'Les étoiles sont les alchimistes de l\'univers, transformant l\'hydrogène en éléments plus lourds. Chaque atome de votre corps a été forgé dans le cœur d\'une étoile mourante.'
  },
  {
    id: 'fractal',
    name: 'FRACTALE',
    color: '#ffc800',
    symbol: '🔸',
    title: 'Géométrie Cosmique',
    description: 'L\'univers répète ses motifs à toutes les échelles. Des galaxies aux neurones, la même géométrie sacrée se déploie, révélant l\'ordre caché dans le chaos.'
  },
  {
    id: 'asteroid',
    name: 'ASTÉROÏDES',
    color: '#8b7765',
    symbol: '☄️',
    title: 'Vestiges Primordiaux',
    description: 'Ces fragments rocheux sont les témoins du système solaire naissant. Porteurs d\'eau et de molécules organiques, ils ont peut-être ensemencé la vie sur Terre.'
  },
  {
    id: 'ocean',
    name: 'OCÉAN COSMIQUE',
    color: '#00c8ff',
    symbol: '🌊',
    title: 'Fluide Universel',
    description: 'L\'espace n\'est pas vide, mais rempli d\'un océan invisible d\'énergie sombre et de matière noire. Des vagues gravitationnelles le parcourent, échos de cataclysmes cosmiques.'
  },
  {
    id: 'aurora',
    name: 'AURORA',
    color: '#00ff7f',
    symbol: '✨',
    title: 'Danse Magnétique',
    description: 'Quand le vent solaire rencontre les champs magnétiques planétaires, un spectacle lumineux se déploie. Les particules chargées peignent le ciel de couleurs irréelles.'
  },
  {
    id: 'wormhole',
    name: 'VORTEX',
    color: '#ff00ff',
    symbol: '🌀',
    title: 'Pont Spatio-Temporel',
    description: 'Les équations de la relativité générale suggèrent l\'existence de raccourcis dans l\'espace-temps. Ces tunnels hypothétiques pourraient relier des régions distantes de l\'univers.'
  },
  {
    id: 'glitch',
    name: 'GLITCH',
    color: '#ff0000',
    symbol: '⚠️',
    title: 'Anomalie Quantique',
    description: 'À l\'échelle quantique, la réalité devient probabiliste. Les particules existent dans plusieurs états simultanément, défiant notre logique macroscopique.'
  },
  {
    id: 'singularity',
    name: 'SINGULARITÉ',
    color: '#ffffff',
    symbol: '⚫',
    title: 'L\'Horizon Absolu',
    description: 'Au centre des trous noirs, la densité devient infinie et le temps s\'arrête. C\'est la limite de notre compréhension physique, un mystère insondable.'
  }
];

export const getUniverseById = (id) => {
  return universeData.find(u => u.id === id);
};

export const getUniverseByIndex = (index) => {
  return universeData[index] || universeData[0];
};
