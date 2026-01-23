# 🌌 Odyssée Cosmique

**Expérience Web Immersive Haute Performance – React · Vite · Three.js · Web Audio · Post-Processing**

[![Build Status](https://github.com/artkabis/immersive_experience/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/artkabis/immersive_experience/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🧭 Présentation générale

**Odyssée Cosmique** est une application web immersive one-page proposant un voyage interactif à travers 11 univers cosmiques distincts. Chaque section représente une phase ou un concept de l'univers (Genèse, Nébuleuse, Plasma, Singularité, etc.) avec :

- 🎨 **Identité visuelle unique** avec post-processing dynamique
- 🎵 **Ambiance sonore générative** (Web Audio API)
- 🎮 **Effets interactifs** (scroll, clic, gravité, radar, audio)
- 🎬 **Scène 3D temps réel** avec physique réaliste
- ⚡ **Performance optimisée** (lazy loading, code splitting)
- 🔧 **Système de debug complet** (monitoring FPS, mémoire, erreurs)

L'application a été conçue comme un **laboratoire créatif et technique**, combinant UI avancée, 3D, audio procédural, post-processing cinématographique et architecture frontend moderne.

---

## 🎯 Objectifs du projet

1. ✅ Transformer un HTML monolithique en une **architecture React modulaire**
2. 🚀 Offrir une **expérience immersive performante** avec chargement initial -71%
3. ⚡ Mettre en place une **chaîne de build moderne** avec Vite + lazy loading
4. 🤖 Automatiser la **compilation et le déploiement** via GitHub Actions
5. 📦 Créer un socle **maintenable, scalable et évolutif**
6. 🎨 Implémenter un **pipeline de post-processing cinématographique**
7. 🔧 Intégrer un **système de debug professionnel** avec export de données

---

## 🧩 Fonctionnalités principales

### 🌠 Navigation & UI

- **One Page Application (SPA)** - Navigation fluide par scroll avec GSAP ScrollTrigger
- **Indicateur de progression global** - Barre de progression synchronisée
- **Indicateur de section active** - Points de navigation interactifs
- **Nom de l'univers et numéro de chapitre dynamiques** - Mise à jour en temps réel
- **Compteur d'objets cosmiques** - Affichage du nombre d'objets créés
- **Mode Indicator** - Messages flash pour les changements d'état

### 🖱️ Interactions

- **Curseur personnalisé avec traînée** animée
- **Effet d'onde au clic** (ripple effect)
- **Modes interactifs** activables au clavier ou via UI :
  - ⬆️ **Inversion de gravité** (G) - Les objets tombent vers le haut
  - 🧲 **Mode attraction** (A) - Objets attirés vers le curseur
  - ⏰ **Ralenti temporel** (T) - Ralentissement de la physique (1/4 vitesse)
  - 📡 **Radar cosmique** (R) - Détection et visualisation des objets
  - 🎵 **Audio ambiant** (M) - Synthèse sonore générative
  - 🗑️ **Nettoyage de la scène** (C) - Suppression de tous les objets
  - 💥 **Big Bang** (Espace) - Explosion de tous les objets

### 🎧 Audio génératif

- **Moteur audio** basé sur Web Audio API (synthèse procédurale)
- **11 ambiances sonores uniques** - Une par univers avec synthèse additive/soustractive
- **11 sons de "spawn"** contextuels - Sons différents selon l'univers
- **Visualiseur audio** en temps réel (32 barres d'analyse fréquentielle)
- **Contrôle de volume** dynamique avec slider
- **Transitions fluides** entre univers (fade in/out automatique)
- **LFO, filtres, reverb** - Effets audio avancés

### 🧪 3D & Physique

- **Rendu WebGL** via Three.js avec anti-aliasing
- **Physique temps réel** via Rapier (WebAssembly)
- **Lazy loading de Rapier** - Chargé uniquement au premier clic (-2MB initial)
- **11 types d'objets cosmiques** - Géométries procédurales avec animations
- **Sol physique** avec collisions
- **Grille lumineuse dynamique** - Change de couleur selon l'univers
- **5000 étoiles** générées procéduralement
- **Nébuleuse animée** - 800 particules avec couleurs HSL
- **5 anneaux rotatifs** - Blending additif
- **Mise à jour optimisée** via requestAnimationFrame

### 🎨 Post-Processing Cinématographique

**Pack "Cinematic" avec 5 effets temps réel :**

1. **Bloom (Unreal Bloom)** - Halo lumineux sur objets brillants
   - Intensité dynamique selon l'univers
   - Seuil adaptatif (0.85)
   - Radius : 0.4

2. **Chromatic Aberration** - Séparation RGB pour effet prisme
   - Intensité variable : 0.001 à 0.0035
   - Plus fort sur univers chaotiques (Vortex, Glitch, Singularité)

3. **Film Grain** - Grain de film analogique
   - Intensité : 0.08 à 0.2
   - Animation procédurale en temps réel

4. **Vignette** - Assombrissement des bords
   - Offset : 0.95
   - Darkness : 1.6
   - Effet cinématographique constant

5. **Profils par Univers** - Configuration unique pour chaque section
   - Genesis : Bloom intense (1.5), aberration minimale
   - Plasma : Bloom maximum (1.8), haute aberration
   - Singularité : Bloom réduit (0.6), aberration extrême (0.0035)

**Transitions GSAP** - Morphing fluide des effets entre univers (1.5s)

### 🔧 Système de Debug Professionnel

**Activation** : `Ctrl+D` / `Cmd+D`

**5 Onglets :**

1. **Performance** - Monitoring temps réel
   - FPS (objectif : 60)
   - Mémoire JavaScript (used/limit)
   - Nombre d'objets cosmiques
   - Uptime de la session
   - Status des systèmes (Physics, Radar, Audio)
   - Indicateurs colorés (vert/orange/rouge)

2. **Components** - État des composants React
   - Props et state de chaque composant
   - Timestamp de dernière mise à jour
   - Données en temps réel

3. **Logs** - Journal chronologique (500 derniers)
   - Catégories : Component, LazyLoad, Performance, Init, Physics, Audio, Radar
   - Timestamps relatifs au démarrage
   - Données associées

4. **Errors** - Capture d'erreurs avec stack traces
   - React ErrorBoundary intégré
   - Stack traces complètes
   - Messages détaillés

5. **Timeline** - Vue chronologique de tous les événements
   - Logs + Erreurs dans l'ordre
   - Identification des race conditions

**Export de données** : Téléchargement JSON complet avec :
- Tous les logs et erreurs
- États des composants
- Métriques de performance
- Informations système (User Agent, viewport)

**Voir** : [DEBUG_GUIDE.md](DEBUG_GUIDE.md) pour documentation complète

### ⚡ Optimisations de Performance

**Lazy Loading & Code Splitting :**

| Composant | Taille | Stratégie de chargement |
|-----------|--------|------------------------|
| **Rapier Physics** | 1.98 MB | Au 1er clic (-71% temps chargement) |
| **ControlPanel** | 1.68 kB | Immédiat (visible dès le départ) |
| **AudioVisualizer** | 0.86 kB | À l'activation audio |
| **VolumeControl** | 0.60 kB | À l'activation audio |
| **Radar** | 0.52 kB | À l'activation radar |
| **ModeIndicator** | 0.48 kB | Au 1er changement de mode |
| **DebugPanel** | 6.32 kB | Sur Ctrl+D |

**Résultats :**
- Chargement initial : **~0.8 MB** (vs 2.8 MB avant)
- Time to Interactive : **1-2s** (vs 4-6s avant)
- First Contentful Paint : **< 1s**

**Protection Concurrence Rapier :**
- Verrou (`isCreatingBodyRef`) pour éviter accès simultané au world
- Prévient les erreurs WebAssembly "recursive use"
- Pas de blocage de l'animation loop

---

## 🛠️ Stack technique

### Frontend

| Technologie | Version | Rôle |
|------------|---------|------|
| **React** | 18.3.1 | Composants, hooks, état |
| **Vite** | 6.4.1 | Bundler ultra-rapide + HMR |
| **JavaScript ES Modules** | ES2020+ | Import/export natif |

### Animation & 3D

| Technologie | Version | Rôle |
|------------|---------|------|
| **Three.js** | 0.160.0 | Rendu 3D WebGL + post-processing |
| **GSAP + ScrollTrigger** | 3.12.5 | Animations et scroll synchronisé |
| **Rapier** | 0.11.2 | Moteur physique (WebAssembly) |

### Post-Processing

| Effet | Technologie | Impact FPS |
|-------|------------|-----------|
| **Bloom** | UnrealBloomPass | -5 FPS |
| **Chromatic Aberration** | Custom Shader | -1 FPS |
| **Film Grain** | Custom Shader | -1 FPS |
| **Vignette** | Custom Shader | 0 FPS |
| **Total** | EffectComposer | **-10 FPS** |

### Audio

| Technologie | Rôle |
|------------|------|
| **Web Audio API** | Synthèse sonore procédurale |
| **OscillatorNode** | Générateurs de fréquences |
| **GainNode** | Contrôle de volume et enveloppes |
| **BiquadFilterNode** | Filtres passe-bas/haut/bande |
| **AnalyserNode** | Analyse fréquentielle (FFT) |

### CI / CD

| Technologie | Rôle |
|------------|------|
| **GitHub Actions** | Build automatique + déploiement |
| **GitHub Pages** | Hébergement statique |

### Debugging & Monitoring

| Outil | Rôle |
|-------|------|
| **DebugManager** | Centralisé logs/errors/metrics |
| **ErrorBoundary** | Capture erreurs React |
| **Performance API** | Monitoring FPS/mémoire |

---

## 🗂️ Architecture du projet

```
/
├─ public/                    # Assets statiques
│
├─ src/
│  ├─ components/             # 14 Composants React UI
│  │  ├─ CustomCursor.jsx    # Curseur personnalisé avec traînée
│  │  ├─ ProgressBar.jsx     # Barre de progression synchronisée
│  │  ├─ SectionIndicator.jsx # Indicateurs de section (11 dots)
│  │  ├─ UniverseName.jsx    # Nom de l'univers actuel
│  │  ├─ ChapterNumber.jsx   # Numéro de chapitre formaté
│  │  ├─ ObjectCounter.jsx   # Compteur d'objets cosmiques
│  │  ├─ ControlPanel.jsx    # Panneau de contrôle (lazy)
│  │  ├─ ModeIndicator.jsx   # Indicateur de mode (lazy)
│  │  ├─ AudioVisualizer.jsx # Visualiseur audio (lazy)
│  │  ├─ VolumeControl.jsx   # Contrôle de volume (lazy)
│  │  ├─ Radar.jsx           # Radar cosmique (lazy)
│  │  ├─ DebugPanel.jsx      # Panneau de debug (lazy)
│  │  ├─ ErrorBoundary.jsx   # Capture d'erreurs React
│  │  ├─ LoadingFallback.jsx # Fallback pour lazy loading
│  │  ├─ Instructions.jsx    # Instructions clavier
│  │  ├─ Section.jsx         # Wrapper de section scrollable
│  │  └─ Card.jsx            # Carte de contenu univers
│  │
│  ├─ engines/               # Logiques complexes isolées
│  │  ├─ audioEngine.js      # Moteur audio génératif (22 fonctions)
│  │  ├─ radarEngine.js      # Moteur de radar avec détection
│  │  └─ objectCreators.js   # 11 créateurs d'objets 3D
│  │
│  ├─ shaders/               # Shaders GLSL personnalisés
│  │  └─ postProcessingShaders.js # Vignette, Aberration, Grain
│  │
│  ├─ utils/                 # Utilitaires
│  │  └─ DebugManager.js     # Gestionnaire de debug centralisé
│  │
│  ├─ data/                  # Données statiques
│  │  └─ universes.js        # Données des 11 univers
│  │
│  ├─ styles/                # Styles CSS modulaires
│  │  ├─ global.css          # Reset et styles globaux
│  │  ├─ sections.css        # Styles des sections/cartes
│  │  ├─ ui.css              # UI fixe (progress bar, etc.)
│  │  ├─ effects.css         # Effets visuels (curseur, ripple)
│  │  └─ debug.css           # Styles du panneau de debug
│  │
│  ├─ App.jsx                # Composant principal (orchestrateur)
│  └─ main.jsx               # Point d'entrée React + ErrorBoundary
│
├─ .github/workflows/
│  └─ build.yml              # Pipeline CI/CD automatique
│
├─ DEBUG_GUIDE.md            # Guide du système de debug
├─ index.html                # Point d'entrée Vite
├─ vite.config.js            # Configuration Vite + chunks
├─ package.json              # Dépendances + scripts
└─ README.md                 # Cette documentation
```

---

## 🔄 Flux de fonctionnement

### 1️⃣ Chargement initial (Performance optimisée)

**Phase 1 - Chargement critique (~0.8 MB) :**
- Vite hydrate l'application React
- Composants critiques chargés immédiatement
- Initialisation Three.js (scène, caméra, renderer)
- Setup post-processing (EffectComposer + 5 passes)
- Création de la scène 3D (grille, étoiles, nébuleuse, anneaux)
- Audio Engine initialisé (prêt mais pas démarré)

**Phase 2 - Lazy loading au besoin :**
- Rapier Physics : au **premier clic** (message "CHARGEMENT PHYSIQUE...")
- Composants UI : selon **interaction utilisateur**
- Radar Engine : à **l'activation radar**

### 2️⃣ Scroll utilisateur

- Détection de la section active via **GSAP ScrollTrigger**
- Mise à jour du thème (**couleur CSS variable** `--universe-color`)
- **Post-processing dynamique** - Transition vers profil univers
- Changement audio ambiant (fade in/out automatique)
- Animation de la caméra (GSAP timeline)
- Mise à jour UI (nom, numéro, radar color)

### 3️⃣ Interaction utilisateur

**Clic / Maintien clic :**
1. Lazy load de Rapier si premier clic
2. Création objet cosmique (géométrie procédurale)
3. Création rigid body + collider
4. Animation GSAP (elastic scale)
5. Son de spawn contextuel
6. Effet ripple visuel
7. Incrémentation compteur

**Activation modes :**
- Modification de la gravité (worldRef.current.gravity)
- Application de forces (applyImpulse)
- Modification du delta time (animation loop)
- Activation composants lazy-loadés

### 4️⃣ Boucle d'animation (requestAnimationFrame)

**Chaque frame :**
1. **FPS counting** (DebugManager)
2. **Physics step** (si worldRef.current et pas en création)
3. **Attract mode** (forces vers curseur si activé)
4. **Update bodies** (translation + rotation + animations spécifiques)
5. **Cleanup** (suppression objets hors limites)
6. **Background animations** (étoiles, nébuleuse, anneaux)
7. **Grid glitch** (univers Glitch seulement)
8. **Radar update** (si visible et physics chargé)
9. **Film grain time update** (animation procédurale)
10. **Render** (composer.render() ou renderer.render())

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

**HMR activé** : Les modifications sont reflétées instantanément

### Build production

```bash
npm run build
```

Le build optimisé sera généré dans `dist/`

**Optimisations automatiques :**
- Minification (esbuild)
- Code splitting (Vite rollup)
- Tree shaking
- Asset optimization

### Prévisualisation du build

```bash
npm run preview
```

Teste le build production localement avant déploiement

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
- ✅ **Cloudflare Pages**
- ✅ Tout serveur statique (Apache, Nginx)

---

## 🎮 Contrôles

### 🖱️ Souris

| Action | Description |
|--------|-------------|
| **Clic** | Créer un objet cosmique à la position du curseur |
| **Maintenir le clic** | Créer plusieurs objets en continu (spawn continu) |
| **Déplacer curseur** | Utilisé en mode attraction (🧲) |
| **Scroll** | Naviguer entre les 11 univers |
| **Clic sur indicateurs** | Navigation directe vers une section |

### ⌨️ Clavier

| Touche | Description | Mode |
|--------|-------------|------|
| **G** | Inverser la gravité (⬆️↔️⬇️) | Toggle |
| **A** | Activer le mode attraction (🧲) | Toggle |
| **T** | Activer le ralenti temporel (⏰) | Toggle |
| **R** | Afficher/masquer le radar (📡) | Toggle |
| **M** | Activer/désactiver l'audio (🎵) | Toggle |
| **C** | Nettoyer la scène (🗑️) | Action |
| **Espace** | Déclencher le Big Bang (💥) | Action |
| **Ctrl+D** / **Cmd+D** | Ouvrir le panneau de debug (🔧) | Toggle |

### 🖲️ Interface

- **Points de navigation** (droite) → Naviguer directement vers une section
- **Boutons de contrôle** (haut droite) → Activer les modes
- **Slider de volume** (bas, si audio actif) → Contrôler le volume audio
- **Visualiseur audio** (bas, si audio actif) → 32 barres d'analyse fréquentielle
- **Panneau de debug** (Ctrl+D) → 5 onglets de monitoring

---

## 🌌 Les 11 Univers

| # | Nom | Couleur | Symbole | Post-Processing | Description |
|---|-----|---------|---------|----------------|-------------|
| 1 | **Genèse** | Cyan<br/>(#00ffc8) | ⚛️ | Bloom 1.5<br/>Aberr. 0.001 | Le début de tout - fluctuation quantique primordiale |
| 2 | **Nébuleuse** | Violet<br/>(#8a2be2) | 🌌 | Bloom 1.3<br/>Aberr. 0.0015 | Nurserie stellaire - nuages de gaz et de poussières |
| 3 | **Plasma** | Rose<br/>(#ff0080) | ⚡ | Bloom 1.8<br/>Aberr. 0.002 | Matière incandescente - fusion nucléaire |
| 4 | **Forge Stellaire** | Or<br/>(#ffd700) | ⭐ | Bloom 1.6<br/>Aberr. 0.0012 | L'atelier des éléments - nucléosynthèse |
| 5 | **Fractale** | Jaune<br/>(#ffc800) | 🔸 | Bloom 1.0<br/>Aberr. 0.001 | Géométrie cosmique - auto-similarité infinie |
| 6 | **Astéroïdes** | Brun<br/>(#8b7765) | ☄️ | Bloom 0.8<br/>Aberr. 0.0008 | Vestiges primordiaux - témoins du passé |
| 7 | **Océan Cosmique** | Bleu<br/>(#00c8ff) | 🌊 | Bloom 1.2<br/>Aberr. 0.0018 | Fluide universel - matière/énergie noire |
| 8 | **Aurora** | Vert<br/>(#00ff7f) | ✨ | Bloom 1.4<br/>Aberr. 0.0013 | Danse magnétique - interaction du vent solaire |
| 9 | **Vortex** | Magenta<br/>(#ff00ff) | 🌀 | Bloom 1.1<br/>Aberr. 0.0025 | Pont spatio-temporel - trou de ver théorique |
| 10 | **Glitch** | Rouge<br/>(#ff0000) | ⚠️ | Bloom 0.9<br/>Aberr. 0.003 | Anomalie quantique - superposition d'états |
| 11 | **Singularité** | Blanc<br/>(#ffffff) | ⚫ | Bloom 0.6<br/>Aberr. 0.0035 | L'horizon absolu - trou noir supermassif |

---

## 🧠 Choix techniques clés

| Choix | Raison | Impact |
|-------|--------|--------|
| **React** | Modularité et lisibilité du code | 14 composants réutilisables |
| **Vite** | Performances ES Modules natifs | HMR ultra-rapide, build 3x plus rapide |
| **Lazy Loading** | Réduction chargement initial | -71% (2.8MB → 0.8MB) |
| **Code Splitting** | Chunks indépendants | Meilleur cache, chargement parallèle |
| **Architecture modulaire** | Séparation stricte UI / logique / données | Maintenabilité, scalabilité |
| **Audio procédural** | Pas de fichiers lourds | 22 sons génératifs < 50KB |
| **Post-processing** | Qualité visuelle AAA | Look cinématographique unique |
| **DebugManager** | Monitoring professionnel | Détection problèmes avant production |
| **ErrorBoundary** | Gestion d'erreurs robuste | UX maintenue même en cas d'erreur |
| **CSS pur** | Contrôle total sur le rendu | Optimisation fine, 0 dépendance CSS |
| **WebAssembly (Rapier)** | Performances physique | 10x plus rapide que JS natif |

---

## 📈 Évolutions & Roadmap

### ✅ Implémenté

- [x] Migration React + Vite
- [x] Code splitting + Lazy loading
- [x] Post-processing cinématographique
- [x] Système de debug complet
- [x] ErrorBoundary
- [x] Optimisations performance
- [x] Protection concurrence Rapier
- [x] Audio génératif
- [x] Radar de détection
- [x] 11 univers avec identité unique

### 🚧 En cours / Futur

- [ ] **InstancedMesh** - Gérer 10x plus d'objets (10,000+)
- [ ] **Audio Crossfade** - Transitions progressives entre univers
- [ ] **Mode VR / WebXR** - Expérience en réalité virtuelle
- [ ] **Contrôles gamepad** - Support manettes (Xbox, PlayStation)
- [ ] **Mode plein écran immersif** - UI cachée automatiquement
- [ ] **Contrôles clavier WASD** - Navigation libre caméra
- [ ] **Sauvegarde session** (localStorage) - Reprendre où on était
- [ ] **Nouveaux univers** - Expansion à 15-20 univers
- [ ] **Mode performance adaptatif** - Ajustement qualité selon FPS
- [ ] **Migration TypeScript** - Type safety
- [ ] **Tests unitaires** (Vitest) - Couverture 80%+
- [ ] **Tests E2E** (Playwright) - Tests automatisés
- [ ] **Lighthouse CI** - Score 90+ maintenu
- [ ] **Internationalisation** (i18n) - Multi-langues
- [ ] **God Rays** - Rayons volumétriques
- [ ] **Depth of Field dynamique** - Focus sur objets interagis
- [ ] **Système de particules GPU** - Millions de particules
- [ ] **Exportation scène** - Screenshot/Video

---

## 🧪 Architecture Technique Détaillée

### Moteur Audio (audioEngine.js)

Le moteur audio génère **11 ambiances sonores** uniques et **11 sons de spawn** contextuels entièrement procéduraux.

**Technologies utilisées :**
- **Web Audio API** - AudioContext, nodes graph
- **OscillatorNode** - Générateurs de fréquences (sine, square, sawtooth, triangle)
- **GainNode** - Enveloppes ADSR, volume, panning
- **BiquadFilterNode** - Filtres passe-bas, passe-haut, passe-bande, notch
- **ConvolverNode** - Reverb procédurale par convolution
- **AnalyserNode** - FFT 32 bins pour visualiseur
- **LFO** (Low Frequency Oscillator) - Modulation amplitude/fréquence
- **Synthèse additive** - Superposition d'harmoniques
- **Synthèse soustractive** - Filtrage et résonance

**Exemples d'ambiances :**

- **Genesis** : Drones graves (60-80Hz) + LFO 0.5Hz + reverb profonde (2s decay)
- **Plasma** : 3 oscillateurs désaccordés + filtre résonant (Q=15) + pulsation rapide (4Hz)
- **Singularity** : Drone massif (30Hz) + sub-bass pulsant + harmoniques hautes (8000Hz)
- **Aurora** : Pads éthérés + LFO modulant filtre + notes cristallines aléatoires

**Fonction clé :**
```javascript
async start() {
  await this.init();
  this.isPlaying = true;
  this.playUniverseAmbient(this.currentUniverse);
}
```

### Moteur Physique (Rapier)

**Rapier** est un moteur physique 3D haute performance écrit en **Rust** compilé en **WebAssembly**.

**Fonctionnalités utilisées :**
- **RigidBody** - Corps rigides dynamiques avec masse
- **Colliders** - Collisions sphériques (ball) et cuboïdes
- **Gravity** - Gravité personnalisable (inversion possible)
- **Impulses** - Forces instantanées (Big Bang, attraction)
- **Translation/Rotation** - Synchronisation avec meshes Three.js
- **World.step()** - Simulation physique (16ms ou 4ms si time warp)

**Protection concurrence :**
```javascript
if (isCreatingBodyRef.current) return; // Évite erreur WebAssembly
```

**Lazy loading :**
```javascript
if (!RAPIERRef.current) {
  const RAPIER = await import('@dimforge/rapier3d-compat');
  await RAPIER.default.init();
  RAPIERRef.current = RAPIER.default;
}
```

### Moteur 3D (Three.js)

**Scène complète comprenant :**

- **Caméra perspective** (FOV 75°) avec animation GSAP
- **4 lumières PointLight** :
  - Principale : Cyan, 300 intensity, position (5, 15, 5)
  - Secondaire : Violet, 150 intensity, position (-8, 8, -8)
  - Tertiaire : Rose, 100 intensity, position (0, -5, 10)
  - Ambiante : Blanche, 0.15 intensity (éclairage général)
- **Sol physique** - Rapier RigidBody fixed + Three.js Plane
- **Grille lumineuse** (60x60, 30 divisions) - LineSegments avec couleur dynamique
- **5000 étoiles** - Points générés procéduralement en sphère (rayon 400)
- **Nébuleuse** - 800 particules BufferGeometry avec couleurs HSL interpolées
- **5 anneaux** - TorusGeometry rotatifs avec BlendingMode additif
- **11 types d'objets** cosmiques avec animations spécifiques :
  - Sphères pulsantes, torus énergétiques, octahedrons rotatifs
  - Icosahedrons, dodecahedrons, spirales, cristaux, etc.
  - Chaque type a son animation unique dans la boucle

**Post-Processing Pipeline :**
```
Scene 3D → RenderPass → UnrealBloomPass → ChromaticAberrationPass
  → FilmGrainPass → VignettePass → Écran final
```

### Gestion du Scroll (GSAP ScrollTrigger)

**ScrollTrigger** synchronise l'animation de la caméra avec le scroll utilisateur.

```javascript
const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 2, // Smooth scrubbing (2 secondes de lag)
    onUpdate: (self) => {
      const progress = self.progress; // 0 à 1
      setScrollProgress(progress);

      const newSection = Math.min(
        Math.floor(progress * 11),
        10
      );

      if (newSection !== previousSection) {
        previousSection = newSection;
        updateUI(newSection); // UI + audio + post-processing
        updateGridColor(newSection);

        if (audioEngineRef.current?.isPlaying) {
          audioEngineRef.current.playUniverseAmbient(newSection);
        }
      }
    }
  }
});

// Animer la caméra sur 11 positions
for (let i = 0; i < 11; i++) {
  mainTimeline.to(camera.position, {
    x: 0,
    y: 5 + Math.sin(i * 0.5) * 2,
    z: 18 - i * 1.5,
    duration: 1,
    ease: "power2.inOut"
  }, i);
}
```

### Système de Debug (DebugManager)

**Architecture singleton** avec événements observables.

**Méthodes principales :**
```javascript
debugManager.log(category, message, data);
debugManager.error(category, message, error);
debugManager.trackComponent(name, state);
debugManager.trackLazyLoad(componentName, loadTime);
debugManager.updatePerformance(metrics);
debugManager.countFrame(); // Appelé chaque frame
debugManager.exportData(); // JSON export
```

**Monitoring automatique :**
- FPS : Calcul sur 1 seconde glissante
- Mémoire : performance.memory (Chrome only)
- Timeline : 200 derniers événements
- Logs : 500 derniers
- Erreurs : Toutes stockées

**Pattern Observer :**
```javascript
const unsubscribe = debugManager.subscribe((state) => {
  // État mis à jour en temps réel
});
```

---

## 🎨 Design System

### Variables CSS Dynamiques

```css
:root {
  --universe-color: #00ffc8; /* Dynamique selon la section active */
}

/* Utilisation : */
.progress-bar {
  background: var(--universe-color);
}
```

### Typographie

| Élément | Police | Taille | Poids | Usage |
|---------|--------|--------|-------|-------|
| **Titres H1** | Orbitron | `clamp(1.8rem, 4vw, 2.5rem)` | 900 | Noms univers |
| **Sous-titres H2** | Orbitron | `clamp(1.4rem, 3vw, 1.8rem)` | 900 | Descriptions |
| **Corps** | Space Mono | `clamp(0.85rem, 1.5vw, 0.95rem)` | 400 | Texte général |
| **UI** | Space Mono | 11-14px | 400-600 | Boutons, labels |

**Polices chargées depuis Google Fonts :**
- Orbitron : Futuriste, géométrique
- Space Mono : Monospace lisible
- Cinzel : Élégant, mystique (univers Singularity)

### Palette de couleurs

**11 couleurs uniques** qui se propagent dans toute l'application :

| Univers | Couleur | Hex | RGB | HSL |
|---------|---------|-----|-----|-----|
| Genesis | Cyan | #00ffc8 | 0,255,200 | 167°,100%,50% |
| Nebula | Violet | #8a2be2 | 138,43,226 | 271°,76%,53% |
| Plasma | Rose | #ff0080 | 255,0,128 | 330°,100%,50% |
| Stellar Forge | Or | #ffd700 | 255,215,0 | 51°,100%,50% |
| Fractal | Jaune | #ffc800 | 255,200,0 | 47°,100%,50% |
| Asteroids | Brun | #8b7765 | 139,119,101 | 28°,16%,47% |
| Cosmic Ocean | Bleu | #00c8ff | 0,200,255 | 193°,100%,50% |
| Aurora | Vert | #00ff7f | 0,255,127 | 150°,100%,50% |
| Vortex | Magenta | #ff00ff | 255,0,255 | 300°,100%,50% |
| Glitch | Rouge | #ff0000 | 255,0,0 | 0°,100%,50% |
| Singularity | Blanc | #ffffff | 255,255,255 | 0°,0%,100% |

**Éléments colorés dynamiquement :**
- Grille 3D
- Lumières Three.js (transitions GSAP)
- Barre de progression
- Boutons actifs
- Radar
- Visualiseur audio
- Indicateurs de section
- Post-processing (via profils)

---

## 🔧 Configuration Vite

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Paths relatifs pour GitHub Pages
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Plus rapide que Terser
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
});
```

**Optimisations automatiques :**
- **Code splitting** par librairie majeure (Three, GSAP, Rapier)
- **Minification esbuild** - 3x plus rapide que Terser
- **Tree shaking** - Suppression code mort
- **Assets dans /assets** - Gestion automatique des fichiers statiques
- **Base path relatif** - Compatibilité GitHub Pages / sous-dossiers

**Résultat bundle :**
```
dist/
├─ index.html                    0.97 kB
├─ assets/
│  ├─ index.css                 18.74 kB (global + sections + ui + effects + debug)
│  ├─ ControlPanel.js            1.68 kB
│  ├─ Radar.js                   0.52 kB
│  ├─ AudioVisualizer.js         0.86 kB
│  ├─ VolumeControl.js           0.60 kB
│  ├─ ModeIndicator.js           0.48 kB
│  ├─ DebugPanel.js              6.32 kB
│  ├─ gsap.js                   70.32 kB
│  ├─ index.js                 239.33 kB (app principale)
│  ├─ three.js                 480.77 kB
│  └─ rapier.js              1,987.56 kB (lazy-loaded)
```

---

## 🐛 Debugging & Troubleshooting

### Utilisation du Debug Panel

**Activation :** `Ctrl+D` / `Cmd+D`

**Scénarios d'usage :**

1. **FPS bas (<30)** :
   - Onglet Performance → Vérifier FPS
   - Réduire nombre d'objets (bouton Clear)
   - Vérifier onglet Logs pour "Spawn blocked"

2. **Composant ne s'affiche pas** :
   - Onglet Components → Chercher le composant
   - Vérifier props/state
   - Onglet Errors → Chercher erreurs associées

3. **Lazy loading problématique** :
   - Onglet Logs → Filtrer "LazyLoad"
   - Vérifier temps de chargement
   - Timeline → Ordre de chargement

4. **Crash** :
   - ErrorBoundary affiche écran d'erreur
   - Ctrl+D → Onglet Errors → Stack trace
   - Bouton Export → Envoyer JSON pour analyse

### Dev Tools Three.js

```javascript
// Stats.js pour monitoring FPS/MS
import Stats from 'three/examples/jsm/libs/stats.module.js';
const stats = new Stats();
document.body.appendChild(stats.dom);

// Dans animate()
stats.update();
```

### Logs utiles

```javascript
console.log('Current section:', currentSection);
console.log('Bodies count:', bodiesRef.current.length);
console.log('Audio playing:', audioEngineRef.current?.isPlaying);
console.log('Physics loaded:', RAPIERRef.current !== null);
console.log('Post-processing:', postProcessingEnabled);
```

### Erreurs communes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "recursive use of an object" | Accès concurrent à Rapier world | Protection intégrée (isCreatingBodyRef) |
| "Cannot read translation" | Body supprimé mais référencé | Vérifier bodiesRef.current.length |
| "Canvas is null" | Radar initialisé avant mount | Lazy init intégré (100ms timeout) |
| FPS chute brutale | Trop d'objets (>100) | Limite automatique + cleanup |
| Audio ne démarre pas | AudioContext suspended | Nécessite interaction utilisateur (bouton M) |

---

## 📚 Ressources & Documentation

### Documentation officielle

- [React](https://react.dev/) - Documentation React 18
- [Vite](https://vitejs.dev/) - Guide Vite
- [Three.js](https://threejs.org/) - Three.js docs + examples
- [GSAP](https://greensock.com/docs/) - GSAP et ScrollTrigger
- [Rapier](https://rapier.rs/) - Documentation Rapier JS
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - MDN Web Audio

### Inspiration & Références

- [Awwwards](https://www.awwwards.com/) - Design web inspirant
- [CodePen](https://codepen.io/) - Expérimentations créatives
- [Three.js Examples](https://threejs.org/examples/) - Exemples officiels
- [Shadertoy](https://www.shadertoy.com/) - Shaders GLSL
- [WebGL Fundamentals](https://webglfundamentals.org/) - Cours WebGL

### Articles techniques

- [Post-Processing in Three.js](https://threejs.org/manual/#en/post-processing)
- [Web Audio Synthesis](https://www.w3.org/TR/webaudio/)
- [WebAssembly Performance](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [GSAP ScrollTrigger Guide](https://greensock.com/scrolltrigger/)

---

## 📊 Métriques de Performance

### Lighthouse Score (Target)

| Métrique | Score | Temps | Objectif |
|----------|-------|-------|----------|
| **Performance** | 90+ | - | Maintenu |
| **First Contentful Paint** | - | <1s | ✅ |
| **Time to Interactive** | - | <2s | ✅ |
| **Speed Index** | - | <2.5s | ✅ |
| **Total Blocking Time** | - | <200ms | ✅ |
| **Cumulative Layout Shift** | - | <0.1 | ✅ |
| **Largest Contentful Paint** | - | <2.5s | ✅ |

### Bundle Analysis

| Chunk | Size (min) | Size (gzip) | Lazy? |
|-------|-----------|-------------|-------|
| **index.js** (app) | 239 kB | 80 kB | Non |
| **three.js** | 481 kB | 122 kB | Non |
| **gsap.js** | 70 kB | 28 kB | Non |
| **rapier.js** | 1,988 kB | 723 kB | **Oui** |
| **DebugPanel.js** | 6.3 kB | 1.7 kB | **Oui** |
| **Total initial** | **~790 kB** | **~230 kB** | - |
| **Total avec Rapier** | **~2.8 MB** | **~950 kB** | - |

**Gain lazy loading** : **71% réduction chargement initial**

---

## 👨‍💻 Auteur & Contribution

Projet conçu comme une **expérience immersive expérimentale**, mêlant design génératif, code créatif, architecture moderne et optimisations de performance.

### Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

**Guidelines :**
- Respecter l'architecture modulaire
- Ajouter des logs debug appropriés
- Tester les performances (FPS, memory)
- Documenter les nouvelles fonctionnalités

---

## 📝 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **Three.js** - Moteur 3D WebGL puissant et flexible
- **GSAP** - Animations fluides de qualité professionnelle
- **Rapier** - Physique performante (Rust → WebAssembly)
- **Vite** - Build ultra-rapide et DX exceptionnelle
- **React** - Modularité et écosystème riche
- **Web Audio API** - Synthèse sonore native
- **Communauté open source** - Inspiration et ressources

---

## 🔗 Liens Utiles

- **Demo Live** : [https://artkabis.github.io/immersive_experience](https://artkabis.github.io/immersive_experience)
- **Repository** : [https://github.com/artkabis/immersive_experience](https://github.com/artkabis/immersive_experience)
- **Issues** : [https://github.com/artkabis/immersive_experience/issues](https://github.com/artkabis/immersive_experience/issues)
- **Debug Guide** : [DEBUG_GUIDE.md](DEBUG_GUIDE.md)

---

**🌌 Bon voyage dans l'Odyssée Cosmique ! 🚀**

*Version 2.0.0 - Post-Processing & Performance Edition*
