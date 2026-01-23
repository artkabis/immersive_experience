# 🔧 Guide du Système de Debug

## Activation

Appuyez sur **Ctrl+D** (Windows/Linux) ou **Cmd+D** (Mac) pour afficher/masquer le panneau de debug.

## Onglets Disponibles

### 📊 Performance
Affiche les métriques en temps réel :
- **FPS** : Images par seconde (objectif : 60 FPS)
- **Memory** : Utilisation de la mémoire JavaScript
- **Objects** : Nombre d'objets cosmiques créés
- **Uptime** : Temps écoulé depuis le lancement

**Status du Système :**
- Physics Engine : État du moteur physique Rapier
- Radar : État du radar de détection
- Audio : État du moteur audio

### 🧩 Components
Liste tous les composants React avec leur état actuel :
- Affiche les props et state de chaque composant
- Timestamp de dernière mise à jour
- Données en temps réel

### 📝 Logs
Journal chronologique des événements :
- Catégories : Component, LazyLoad, Performance, Init, Physics, Audio, etc.
- Timestamp relatif au démarrage
- Données associées à chaque log

### ❌ Errors
Liste des erreurs capturées :
- Message d'erreur
- Stack trace complet
- Catégorie et timestamp
- Si aucune erreur : ✓ No errors logged

### ⏱️ Timeline
Vue chronologique de tous les événements (logs + erreurs) :
- Permet de suivre l'ordre exact des opérations
- Identifie les problèmes de timing
- Aide au debugging de race conditions

## Actions Disponibles

### Clear
Efface tous les logs et la timeline (garde les erreurs).

### Export
Télécharge un fichier JSON avec :
- Tous les logs
- Toutes les erreurs
- États des composants
- Métriques de performance
- Informations système (User Agent, viewport, etc.)

**Format du fichier :** `debug-{timestamp}.json`

## Indicateurs Visuels

### Couleurs des métriques
- 🟢 **Vert** : Performance optimale
- 🟠 **Orange** : Attention requise
- 🔴 **Rouge** : Problème de performance

### FPS
- Vert : 45-60 FPS
- Orange : 30-44 FPS
- Rouge : < 30 FPS

### Memory
- Vert : < 60% de la limite
- Orange : 60-80% de la limite
- Rouge : > 80% de la limite

## Catégories de Logs

| Catégorie | Description | Couleur |
|-----------|-------------|---------|
| **Component** | Lifecycle et état des composants React | Violet |
| **LazyLoad** | Chargement dynamique des modules | Orange |
| **Performance** | Métriques et optimisations | Vert |
| **Init** | Initialisation de l'application | Bleu |
| **Physics** | Moteur physique Rapier | Rose |
| **Audio** | Moteur audio et sons | Cyan |
| **Radar** | Système de détection | Jaune |

## Utilisation pour le Debugging

### 1. Problème de Performance
1. Ouvrir l'onglet **Performance**
2. Vérifier le FPS (doit être ≥ 30)
3. Vérifier l'utilisation mémoire
4. Si FPS bas : réduire le nombre d'objets cosmiques

### 2. Composant ne s'affiche pas
1. Ouvrir l'onglet **Components**
2. Chercher le composant concerné
3. Vérifier ses props et state
4. Vérifier l'onglet **Errors** pour des erreurs

### 3. Lazy Loading ne fonctionne pas
1. Ouvrir l'onglet **Logs**
2. Filtrer par catégorie **LazyLoad**
3. Vérifier les temps de chargement
4. Consulter la **Timeline** pour l'ordre de chargement

### 4. Crash ou Erreur
1. L'**Error Boundary** affiche automatiquement un écran d'erreur
2. Ouvrir le Debug Panel (Ctrl+D)
3. Onglet **Errors** : stack trace complète
4. Exporter les données pour analyse approfondie

## Analyse des Données Exportées

Le fichier JSON exporté contient :

```json
{
  "logs": [...],              // Tous les logs
  "errors": [...],            // Toutes les erreurs
  "performanceMetrics": {     // Métriques finales
    "fps": 60,
    "memory": {...},
    "objectCount": 45,
    ...
  },
  "componentStates": [...],   // État de tous les composants
  "timeline": [...],          // Timeline complète
  "uptime": 123456,          // Durée de la session (ms)
  "exportTime": "2024-...",  // ISO timestamp
  "userAgent": "...",        // Navigateur
  "viewport": {...}          // Dimensions écran
}
```

### Analyser avec jq (ligne de commande)
```bash
# Compter les erreurs
cat debug-*.json | jq '.errors | length'

# Lister les composants
cat debug-*.json | jq '.componentStates[].name'

# FPS moyen
cat debug-*.json | jq '.performanceMetrics.fps'

# Temps de chargement de Rapier
cat debug-*.json | jq '.logs[] | select(.category=="LazyLoad" and .message | contains("RAPIER"))'
```

## Performance du Debug Panel

- **Impact sur les performances** : Minimal (~1-2% overhead)
- **Taille du bundle** : +6.32 kB (lazy-loaded)
- **Mémoire** : ~2-5 MB selon l'utilisation
- **FPS impact** : 0 (le panel ne rend que quand visible)

## Tips

1. **Désactiver en production** : Le debug panel n'est utile qu'en développement
2. **Exporter régulièrement** : Sauvegardez les sessions de test importantes
3. **Utiliser la Timeline** : Meilleur outil pour comprendre l'ordre des événements
4. **Monitorer la mémoire** : Si > 80%, cliquer sur "CLEAR" (bouton trash dans les contrôles)

## Intégration Custom

Pour ajouter vos propres logs dans le code :

```javascript
import debugManager from './utils/DebugManager.js';

// Log simple
debugManager.log('MyCategory', 'Mon message', { data: 'optionnel' });

// Erreur
debugManager.error('MyCategory', 'Message d\'erreur', error);

// Tracking composant
debugManager.trackComponent('MonComposant', {
  prop1: value1,
  prop2: value2
});

// Mise à jour performance
debugManager.updatePerformance({
  customMetric: value
});
```

---

**Note :** Le système de debug est automatiquement désactivé en mode production (NODE_ENV=production).
