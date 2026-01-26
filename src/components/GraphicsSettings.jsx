import { useState, useEffect } from 'react';
import './GraphicsSettings.css';

function GraphicsSettings({
  visible,
  onClose,
  settings,
  onSettingsChange,
  currentFPS = 0
}) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('quality'); // quality, lighting, postprocessing, performance

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (category, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handlePresetChange = (preset) => {
    const newSettings = { ...localSettings };
    newSettings.quality.preset = preset;
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefault = () => {
    const defaultSettings = {
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
        showFPS: true
      }
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const exportSettings = () => {
    const json = JSON.stringify(localSettings, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'odyssee-cosmique-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!visible) return null;

  const getFPSColor = () => {
    if (currentFPS >= 55) return '#00ffc8'; // Excellent
    if (currentFPS >= 40) return '#ffdd00'; // Good
    if (currentFPS >= 25) return '#ff8800'; // Fair
    return '#ff0066'; // Poor
  };

  return (
    <div className="graphics-settings-overlay" onClick={onClose}>
      <div className="graphics-settings-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="graphics-settings-header">
          <h2>⚙️ Paramètres Graphiques</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* FPS Monitor */}
        {localSettings.performance.showFPS && (
          <div className="fps-monitor" style={{ borderColor: getFPSColor() }}>
            <span className="fps-label">FPS</span>
            <span className="fps-value" style={{ color: getFPSColor() }}>
              {Math.round(currentFPS)}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={activeTab === 'quality' ? 'active' : ''}
            onClick={() => setActiveTab('quality')}
          >
            🎯 Qualité
          </button>
          <button
            className={activeTab === 'lighting' ? 'active' : ''}
            onClick={() => setActiveTab('lighting')}
          >
            💡 Éclairage
          </button>
          <button
            className={activeTab === 'postprocessing' ? 'active' : ''}
            onClick={() => setActiveTab('postprocessing')}
          >
            ✨ Post-Processing
          </button>
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
          >
            📊 Performance
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* QUALITY TAB */}
          {activeTab === 'quality' && (
            <div className="settings-section">
              <h3>Préréglages de Qualité</h3>

              <div className="preset-buttons">
                <button
                  className={localSettings.quality.preset === 'low' ? 'preset-btn active' : 'preset-btn'}
                  onClick={() => handlePresetChange('low')}
                >
                  🟢 Low<br/><small>+60 FPS</small>
                </button>
                <button
                  className={localSettings.quality.preset === 'medium' ? 'preset-btn active' : 'preset-btn'}
                  onClick={() => handlePresetChange('medium')}
                >
                  🟡 Medium<br/><small>Équilibré</small>
                </button>
                <button
                  className={localSettings.quality.preset === 'high' ? 'preset-btn active' : 'preset-btn'}
                  onClick={() => handlePresetChange('high')}
                >
                  🟠 High<br/><small>Qualité++</small>
                </button>
                <button
                  className={localSettings.quality.preset === 'ultra' ? 'preset-btn active' : 'preset-btn'}
                  onClick={() => handlePresetChange('ultra')}
                >
                  🔴 Ultra<br/><small>Maximum</small>
                </button>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.quality.autoAdjust}
                    onChange={(e) => handleChange('quality', 'autoAdjust', e.target.checked)}
                  />
                  <span className="checkbox-label">Ajustement Automatique (FPS Target)</span>
                </label>
                <p className="setting-description">
                  Ajuste automatiquement la qualité pour maintenir les FPS cibles
                </p>
              </div>

              <div className="preset-info">
                <h4>Préréglage actuel : {localSettings.quality.preset.toUpperCase()}</h4>
                <ul>
                  <li>Max Objets : {localSettings.performance.maxObjects}</li>
                  <li>Étoiles : {localSettings.performance.starCount}</li>
                  <li>Nébuleuse : {localSettings.performance.nebulaCount}</li>
                  <li>Post-Processing : {localSettings.postProcessing.enabled ? 'Activé' : 'Désactivé'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* LIGHTING TAB */}
          {activeTab === 'lighting' && (
            <div className="settings-section">
              <h3>Configuration de l'Éclairage</h3>

              <div className="setting-item">
                <label>
                  <span>Lumière Ambiante</span>
                  <span className="value">{localSettings.lighting.ambientIntensity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localSettings.lighting.ambientIntensity}
                  onChange={(e) => handleChange('lighting', 'ambientIntensity', parseFloat(e.target.value))}
                />
                <p className="setting-description">Luminosité générale de la scène</p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Lumière Principale</span>
                  <span className="value">{localSettings.lighting.mainLightIntensity}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={localSettings.lighting.mainLightIntensity}
                  onChange={(e) => handleChange('lighting', 'mainLightIntensity', parseFloat(e.target.value))}
                />
                <p className="setting-description">Intensité de la lumière principale cyan</p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Lumière Secondaire</span>
                  <span className="value">{localSettings.lighting.secondaryLightIntensity}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={localSettings.lighting.secondaryLightIntensity}
                  onChange={(e) => handleChange('lighting', 'secondaryLightIntensity', parseFloat(e.target.value))}
                />
                <p className="setting-description">Intensité de la lumière violette</p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Intensité Glow des Objets</span>
                  <span className="value">{localSettings.lighting.glowIntensity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localSettings.lighting.glowIntensity}
                  onChange={(e) => handleChange('lighting', 'glowIntensity', parseFloat(e.target.value))}
                />
                <p className="setting-description">Luminosité des objets créés au clic (emissive)</p>
              </div>
            </div>
          )}

          {/* POST-PROCESSING TAB */}
          {activeTab === 'postprocessing' && (
            <div className="settings-section">
              <h3>Effets Post-Processing</h3>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.postProcessing.enabled}
                    onChange={(e) => handleChange('postProcessing', 'enabled', e.target.checked)}
                  />
                  <span className="checkbox-label">Activer Post-Processing</span>
                </label>
                <p className="setting-description">
                  Active/désactive tous les effets (-10 FPS si activé)
                </p>
              </div>

              {localSettings.postProcessing.enabled && (
                <>
                  <div className="setting-item">
                    <label>
                      <span>Bloom - Force</span>
                      <span className="value">{localSettings.postProcessing.bloomStrength.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={localSettings.postProcessing.bloomStrength}
                      onChange={(e) => handleChange('postProcessing', 'bloomStrength', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="setting-item">
                    <label>
                      <span>Bloom - Seuil</span>
                      <span className="value">{localSettings.postProcessing.bloomThreshold.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={localSettings.postProcessing.bloomThreshold}
                      onChange={(e) => handleChange('postProcessing', 'bloomThreshold', parseFloat(e.target.value))}
                    />
                    <p className="setting-description">Plus bas = scène plus lumineuse</p>
                  </div>

                  <div className="setting-item">
                    <label>
                      <span>Bloom - Rayon</span>
                      <span className="value">{localSettings.postProcessing.bloomRadius.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={localSettings.postProcessing.bloomRadius}
                      onChange={(e) => handleChange('postProcessing', 'bloomRadius', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="setting-item">
                    <label>
                      <span>Aberration Chromatique</span>
                      <span className="value">{(localSettings.postProcessing.chromaticAberration * 1000).toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.01"
                      step="0.0001"
                      value={localSettings.postProcessing.chromaticAberration}
                      onChange={(e) => handleChange('postProcessing', 'chromaticAberration', parseFloat(e.target.value))}
                    />
                    <p className="setting-description">Effet de séparation RGB (prisme)</p>
                  </div>

                  <div className="setting-item">
                    <label>
                      <span>Vignette</span>
                      <span className="value">{localSettings.postProcessing.vignetteIntensity.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={localSettings.postProcessing.vignetteIntensity}
                      onChange={(e) => handleChange('postProcessing', 'vignetteIntensity', parseFloat(e.target.value))}
                    />
                    <p className="setting-description">Assombrissement des bords</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <div className="settings-section">
              <h3>Paramètres de Performance</h3>

              <div className="setting-item">
                <label>
                  <span>Max Objets Simultanés</span>
                  <span className="value">{localSettings.performance.maxObjects}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={localSettings.performance.maxObjects}
                  onChange={(e) => handleChange('performance', 'maxObjects', parseInt(e.target.value))}
                />
                <p className="setting-description">
                  Limite d'objets créés au clic (plus = plus lourd)
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Nombre d'Étoiles</span>
                  <span className="value">{localSettings.performance.starCount}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={localSettings.performance.starCount}
                  onChange={(e) => handleChange('performance', 'starCount', parseInt(e.target.value))}
                />
                <p className="setting-description">Particules d'étoiles dans le fond</p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Nombre de Nébuleuse</span>
                  <span className="value">{localSettings.performance.nebulaCount}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={localSettings.performance.nebulaCount}
                  onChange={(e) => handleChange('performance', 'nebulaCount', parseInt(e.target.value))}
                />
                <p className="setting-description">Particules de nébuleuse cosmique</p>
              </div>

              <div className="setting-item">
                <label>
                  <span>FPS Cible (Auto-Adjust)</span>
                  <span className="value">{localSettings.performance.targetFPS}</span>
                </label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="targetFPS"
                      value="30"
                      checked={localSettings.performance.targetFPS === 30}
                      onChange={() => handleChange('performance', 'targetFPS', 30)}
                    />
                    30 FPS
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="targetFPS"
                      value="60"
                      checked={localSettings.performance.targetFPS === 60}
                      onChange={() => handleChange('performance', 'targetFPS', 60)}
                    />
                    60 FPS
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="targetFPS"
                      value="120"
                      checked={localSettings.performance.targetFPS === 120}
                      onChange={() => handleChange('performance', 'targetFPS', 120)}
                    />
                    120 FPS
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={localSettings.performance.showFPS}
                    onChange={(e) => handleChange('performance', 'showFPS', e.target.checked)}
                  />
                  <span className="checkbox-label">Afficher le compteur FPS</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="settings-footer">
          <button className="action-btn secondary" onClick={resetToDefault}>
            🔄 Réinitialiser
          </button>
          <button className="action-btn secondary" onClick={exportSettings}>
            💾 Exporter
          </button>
          <button className="action-btn primary" onClick={onClose}>
            ✓ Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

export default GraphicsSettings;
