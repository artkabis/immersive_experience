# 🌌 Odyssée Cosmique

**Expérience Web Immersive – React · Vite · Three.js · Web Audio**

[![Build Status](https://github.com/artkabis/immersive_experience/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/artkabis/immersive_experience/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🧭 Présentation générale

**Odyssée Cosmique** est une application web immersive one-page proposant un voyage interactif à travers différents univers cosmiques. Chaque section représente une phase ou un concept de l'univers (Genèse, Nébuleuse, Plasma, Singularité, etc.) avec :

- 🎨 Une identité visuelle unique
- 🎵 Une ambiance sonore générative
- 🎮 Des effets interactifs (scroll, clic, gravité, radar, audio)
- 🎬 Une scène 3D temps réel

L'application a été conçue comme un **laboratoire créatif et technique**, combinant UI avancée, 3D, audio procédural et architecture frontend moderne.

---

## 🎯 Objectifs du projet

1. ✅ Transformer un HTML monolithique en une **architecture React modulaire**
2. 🚀 Offrir une **expérience immersive performante** malgré une forte richesse visuelle
3. ⚡ Mettre en place une **chaîne de build moderne** avec Vite
4. 🤖 Automatiser la **compilation et le déploiement** via GitHub Actions
5. 📦 Créer un socle **maintenable, scalable et évolutif**

---

## 🧩 Fonctionnalités principales

### 🌠 Navigation & UI

- **One Page Application (SPA)** - Navigation fluide par scroll
- **Indicateur de progression global** - Barre de progression en haut
- **Indicateur de section active** - Points de navigation sur le côté droit
- **Nom de l'univers et numéro de chapitre dynamiques**

### 🖱️ Interactions

- **Curseur personnalisé avec traînée**
- **Effet d'onde au clic**
- **Modes interactifs** activables au clavier ou via UI :
  - ⬆️ Inversion de gravité
  - 🧲 Mode attraction
  - ⏰ Ralenti temporel
  - 📡 Radar cosmique
  - 🎵 Audio ambiant
  - 🗑️ Nettoyage de la scène

### 🎧 Audio génératif

- **Moteur audio** basé sur Web Audio API
- **Ambiance sonore unique** par univers (11 univers)
- **Sons de "spawn"** contextuels
- **Visualiseur audio** en temps réel
- **Contrôle de volume** dynamique

### 🧪 3D & Physique

- **Rendu WebGL** via Three.js
- **Physique temps réel** via Rapier
- **Objets interactifs** soumis à la gravité et aux forces
- **Mise à jour optimisée** via requestAnimationFrame

---

## 🛠️ Stack technique

### Frontend

| Technologie | Rôle |
|------------|------|
| **React** | Composants, hooks, état |
| **Vite** | Bundler rapide et moderne |
| **JavaScript ES Modules** | Import/export natif |

### Animation & 3D

| Technologie | Rôle |
|------------|------|
| **Three.js** | Rendu 3D WebGL |
| **GSAP + ScrollTrigger** | Animations et scroll |
| **Rapier** | Moteur physique |

### Audio

| Technologie | Rôle |
|------------|------|
| **Web Audio API** | Synthèse sonore procédurale |
| **Analyser Node** | Analyse fréquentielle (visualizer) |

### CI / CD

| Technologie | Rôle |
|------------|------|
| **GitHub Actions** | Build automatique |
| **GitHub Pages** | Déploiement |

---

## 🗂️ Architecture du projet

```
/
├─ public/                    # Assets statiques
│
├─ src/
│  ├─ components/            # Composants React UI
│  │  ├─ CustomCursor.jsx   # Curseur personnalisé
│  │  ├─ ProgressBar.jsx    # Barre de progression
│  │  ├─ SectionIndicator.jsx  # Indicateurs de section
│  │  ├─ UniverseName.jsx   # Nom de l'univers
│  │  ├─ ChapterNumber.jsx  # Numéro de chapitre
│  │  ├─ ObjectCounter.jsx  # Compteur d'objets
│  │  ├─ ControlPanel.jsx   # Panneau de contrôle
│  │  ├─ ModeIndicator.jsx  # Indicateur de mode
│  │  ├─ AudioVisualizer.jsx # Visualiseur audio
│  │  ├─ VolumeControl.jsx  # Contrôle de volume
│  │  ├─ Radar.jsx          # Radar cosmique
│  │  ├─ Instructions.jsx   # Instructions
│  │  ├─ Section.jsx        # Wrapper de section
│  │  └─ Card.jsx           # Carte de contenu
│  │
│  ├─ engines/              # Logiques complexes isolées
│  │  ├─ audioEngine.js     # Moteur audio génératif
│  │  ├─ radarEngine.js     # Moteur de radar
│  │  └─ objectCreators.js  # Créateurs d'objets 3D
│  │
│  ├─ data/                 # Données statiques
│  │  └─ universes.js       # Données des 11 univers
│  │
│  ├─ styles/               # Styles CSS modulaires
│  │  ├─ global.css         # Reset et styles globaux
│  │  ├─ sections.css       # Styles des sections/cartes
│  │  ├─ ui.css             # UI fixe (progress bar, etc.)
│  │  └─ effects.css        # Effets visuels (curseur, etc.)
│  │
│  ├─ App.jsx               # Composant principal
│  └─ main.jsx              # Point d'entrée React
│
├─ .github/workflows/
│  └─ build.yml             # Pipeline CI/CD
│
├─ index.html               # Point d'entrée Vite
├─ vite.config.js           # Configuration Vite
├─ package.json             # Dépendances
└─ README.md                # Documentation
```

---

## 🔄 Flux de fonctionnement

### 1️⃣ Chargement initial

- Vite hydrate l'application React
- Initialisation Three.js + Audio Engine + Rapier Physics
- Création de la scène 3D (grille, étoiles, nébuleuse, anneaux)

### 2️⃣ Scroll utilisateur

- Détection de la section active via GSAP ScrollTrigger
- Mise à jour du thème (couleur, univers, audio)
- Animation de la caméra vers la nouvelle position

### 3️⃣ Interaction

- **Clic** → spawn d'objets 3D + son contextuel
- **Activation de modes** (gravité, radar, etc.)
- **Clavier** → raccourcis pour tous les modes

### 4️⃣ Rendu

- Boucle d'animation optimisée (requestAnimationFrame)
- Mise à jour physique (Rapier world.step())
- Synchronisation audio / visuel (visualiseur)

---

## ⚙️ Installation & développement

### Prérequis

- **Node.js** ≥ 18
- **npm** ou **pnpm**

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build production

```bash
npm run build
```

Le build optimisé sera généré dans `dist/`

### Prévisualisation du build

```bash
npm run preview
```

---

## 🚀 Déploiement (GitHub Actions)

Un **workflow** est déclenché automatiquement :

- ✅ À chaque **push** sur `main` ou `claude/**`
- ✅ À chaque **pull_request** vers `main`

### Étapes du workflow

1. **Checkout** du code
2. **Installation** des dépendances (`npm ci`)
3. **Build** Vite (`npm run build`)
4. **Upload** des artefacts (dossier `dist/`)
5. **Déploiement** sur GitHub Pages (branche `gh-pages`)

Le projet est compatible :

- ✅ **GitHub Pages**
- ✅ **Netlify**
- ✅ **Vercel**
- ✅ Tout serveur statique

---

## 🎮 Contrôles

### 🖱️ Souris

| Action | Description |
|--------|-------------|
| **Clic** | Créer un objet cosmique |
| **Maintenir le clic** | Créer plusieurs objets en continu |
| **Scroll** | Naviguer entre les univers |

### ⌨️ Clavier

| Touche | Description |
|--------|-------------|
| **G** | Inverser la gravité (⬆️↔️⬇️) |
| **A** | Activer le mode attraction (🧲) |
| **T** | Activer le ralenti temporel (⏰) |
| **R** | Afficher/masquer le radar (📡) |
| **M** | Activer/désactiver l'audio (🎵) |
| **C** | Nettoyer la scène (🗑️) |
| **Espace** | Déclencher le Big Bang (💥) |

### 🖲️ Interface

- **Points de navigation** (droite) → Naviguer directement vers une section
- **Boutons de contrôle** (haut droite) → Activer les modes
- **Slider de volume** (bas) → Contrôler le volume audio

---

## 🌌 Les 11 Univers

| # | Nom | Couleur | Symbole | Description |
|---|-----|---------|---------|-------------|
| 1 | **Genèse** | Cyan (#00ffc8) | ⚛️ | Le début de tout - fluctuation quantique |
| 2 | **Nébuleuse** | Violet (#8a2be2) | 🌌 | Nurserie stellaire - nuages de gaz |
| 3 | **Plasma** | Rose (#ff0080) | ⚡ | Matière incandescente - fusion nucléaire |
| 4 | **Forge Stellaire** | Or (#ffd700) | ⭐ | L'atelier des éléments - nucléosynthèse |
| 5 | **Fractale** | Jaune (#ffc800) | 🔸 | Géométrie cosmique - auto-similarité |
| 6 | **Astéroïdes** | Brun (#8b7765) | ☄️ | Vestiges primordiaux - témoins du passé |
| 7 | **Océan Cosmique** | Bleu (#00c8ff) | 🌊 | Fluide universel - matière/énergie noire |
| 8 | **Aurora** | Vert (#00ff7f) | ✨ | Danse magnétique - vent solaire |
| 9 | **Vortex** | Magenta (#ff00ff) | 🌀 | Pont spatio-temporel - trou de ver |
| 10 | **Glitch** | Rouge (#ff0000) | ⚠️ | Anomalie quantique - superposition |
| 11 | **Singularité** | Blanc (#ffffff) | ⚫ | L'horizon absolu - trou noir |

---

## 🧠 Choix techniques clés

| Choix | Raison |
|-------|--------|
| **React** | Modularité et lisibilité du code |
| **Vite** | Performances et ES Modules natifs |
| **Architecture modulaire** | Séparation stricte UI / logique / données |
| **Audio procédural** | Pas de fichiers lourds, sons génératifs |
| **CSS pur** | Contrôle total sur le rendu visuel |
| **Pas de framework CSS** | Optimisation des performances |

---

## 📈 Évolutions possibles

- [ ] Mode VR / WebXR
- [ ] Sauvegarde de session (localStorage)
- [ ] Ajout de nouveaux univers
- [ ] Mode performance / low-end
- [ ] Migration TypeScript
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Lighthouse CI
- [ ] Internationalisation (i18n)

---

## 🧪 Architecture Technique Détaillée

### Moteur Audio (audioEngine.js)

Le moteur audio génère **11 ambiances sonores** uniques et **11 sons de spawn** contextuels.

**Technologies utilisées :**
- Web Audio API (OscillatorNode, GainNode, BiquadFilterNode, ConvolverNode)
- Synthèse additive et soustractive
- Modulation LFO (Low Frequency Oscillator)
- Filtres passe-bas, passe-haut, passe-bande
- Reverb procédurale (convolution)

**Exemples d'ambiances :**

- **Genèse** : Drones graves avec LFO + reverb profonde
- **Plasma** : Oscillateurs désaccordés + filtre résonant + pulsation rapide
- **Singularité** : Drone massif + sub-bass pulsant + harmoniques hautes

### Moteur Physique (Rapier)

**Rapier** est un moteur physique 3D performant écrit en Rust compilé en WebAssembly.

**Fonctionnalités utilisées :**
- RigidBody (corps rigides dynamiques)
- Colliders (collisions sphériques)
- Gravity (gravité personnalisable)
- Impulses (forces instantanées)

### Moteur 3D (Three.js)

**Scène complète comprenant :**

- **Caméra perspective** avec animation GSAP
- **4 lumières** (1 point light principale + 3 secondaires)
- **Sol physique** (Rapier + Three.js plane)
- **Grille lumineuse** avec matériaux émissifs
- **5000 étoiles** générées procéduralement
- **Nébuleuse** (800 particules avec couleurs HSL)
- **5 anneaux** rotatifs avec blending additif
- **11 types d'objets** cosmiques (sphères, torus, octahedrons, etc.)

### Gestion du Scroll (GSAP ScrollTrigger)

**ScrollTrigger** synchronise l'animation de la caméra avec le scroll.

```javascript
const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 2, // Smooth scrubbing
    onUpdate: (self) => {
      // Détection de la section active
      const newSection = Math.floor(self.progress * 11);
      // Mise à jour UI + audio + grille
    }
  }
});
```

---

## 🎨 Design System

### Variables CSS

```css
:root {
  --universe-color: #00ffc8; /* Dynamique selon la section */
}
```

### Typographie

| Élément | Police | Taille | Poids |
|---------|--------|--------|-------|
| Titres | Orbitron | clamp(1.8rem, 4vw, 2.5rem) | 900 |
| Sous-titres | Orbitron | clamp(1.4rem, 3vw, 1.8rem) | 900 |
| Corps | Space Mono | clamp(0.85rem, 1.5vw, 0.95rem) | 400 |

### Palette de couleurs

Chaque univers possède sa couleur signature qui colore :
- La grille 3D
- La barre de progression
- Les boutons actifs
- Le radar
- Le visualiseur audio

---

## 🔧 Configuration Vite

```javascript
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
          'rapier': ['@dimforge/rapier3d-compat']
        }
      }
    }
  }
})
```

**Optimisations :**
- Code splitting par librairie
- Minification Terser
- Assets dans `/assets`
- Base path relatif pour compatibilité GitHub Pages

---

## 🐛 Debugging

### Dev Tools

```javascript
// Activer les stats Three.js
import Stats from 'three/examples/jsm/libs/stats.module.js';
const stats = new Stats();
document.body.appendChild(stats.dom);

// Dans la boucle d'animation
stats.update();
```

### Logs utiles

```javascript
console.log('Current section:', currentSection);
console.log('Bodies count:', bodies.length);
console.log('Audio playing:', audioEngine.isPlaying);
```

---

## 📚 Ressources

### Documentation

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [GSAP](https://greensock.com/docs/)
- [Rapier](https://rapier.rs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Inspiration

- [Awwwards](https://www.awwwards.com/)
- [CodePen](https://codepen.io/)
- [Three.js Examples](https://threejs.org/examples/)

---

## 👨‍💻 Auteur

Projet conçu comme une **expérience immersive expérimentale**, mêlant design, code créatif et architecture moderne.

---

## 📝 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **Three.js** pour le moteur 3D
- **GSAP** pour les animations fluides
- **Rapier** pour la physique performante
- **Vite** pour le build ultra-rapide
- **React** pour la modularité

---

**🌌 Bon voyage dans l'Odyssée Cosmique ! 🚀**
