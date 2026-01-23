import React, { useState, useEffect } from 'react';
import debugManager from '../utils/DebugManager.js';

const DebugPanel = ({ visible = false }) => {
  const [debugState, setDebugState] = useState(debugManager.getState());
  const [activeTab, setActiveTab] = useState('performance');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = debugManager.subscribe(setDebugState);
    return unsubscribe;
  }, []);

  if (!visible) return null;

  const handleExport = () => {
    const data = debugManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    debugManager.clear();
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.danger) return '#ff4444';
    if (value >= thresholds.warning) return '#ffaa00';
    return '#00ff88';
  };

  return (
    <div className={`debug-panel ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="debug-header">
        <h3>🔧 DEBUG PANEL</h3>
        <div className="debug-header-actions">
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? '−' : '+'}
          </button>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="debug-tabs">
            <button
              className={activeTab === 'performance' ? 'active' : ''}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button
              className={activeTab === 'components' ? 'active' : ''}
              onClick={() => setActiveTab('components')}
            >
              Components
            </button>
            <button
              className={activeTab === 'logs' ? 'active' : ''}
              onClick={() => setActiveTab('logs')}
            >
              Logs ({debugState.logs.length})
            </button>
            <button
              className={activeTab === 'errors' ? 'active' : ''}
              onClick={() => setActiveTab('errors')}
            >
              Errors ({debugState.errors.length})
            </button>
            <button
              className={activeTab === 'timeline' ? 'active' : ''}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
          </div>

          <div className="debug-content">
            {activeTab === 'performance' && (
              <div className="debug-section">
                <div className="metric-grid">
                  <div className="metric-card">
                    <div className="metric-label">FPS</div>
                    <div
                      className="metric-value"
                      style={{ color: getStatusColor(60 - debugState.performanceMetrics.fps, { danger: 30, warning: 15 }) }}
                    >
                      {debugState.performanceMetrics.fps}
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-bar-fill"
                        style={{
                          width: `${Math.min(100, (debugState.performanceMetrics.fps / 60) * 100)}%`,
                          backgroundColor: getStatusColor(60 - debugState.performanceMetrics.fps, { danger: 30, warning: 15 })
                        }}
                      />
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-label">Memory</div>
                    <div className="metric-value">
                      {debugState.performanceMetrics.memory.used} MB
                    </div>
                    <div className="metric-sub">
                      / {debugState.performanceMetrics.memory.limit} MB
                    </div>
                    <div className="metric-bar">
                      <div
                        className="metric-bar-fill"
                        style={{
                          width: `${(debugState.performanceMetrics.memory.used / debugState.performanceMetrics.memory.limit) * 100}%`,
                          backgroundColor: getStatusColor((debugState.performanceMetrics.memory.used / debugState.performanceMetrics.memory.limit) * 100, { danger: 80, warning: 60 })
                        }}
                      />
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-label">Objects</div>
                    <div className="metric-value">
                      {debugState.performanceMetrics.objectCount}
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-label">Uptime</div>
                    <div className="metric-value small">
                      {formatTime(debugState.uptime)}
                    </div>
                  </div>
                </div>

                <div className="system-status">
                  <h4>System Status</h4>
                  <div className="status-item">
                    <span>Physics Engine:</span>
                    <span className={debugState.performanceMetrics.physicsLoaded ? 'status-loaded' : 'status-pending'}>
                      {debugState.performanceMetrics.physicsLoaded ? '✓ Loaded' : '○ Pending'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span>Radar:</span>
                    <span className={debugState.performanceMetrics.radarLoaded ? 'status-loaded' : 'status-pending'}>
                      {debugState.performanceMetrics.radarLoaded ? '✓ Loaded' : '○ Pending'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span>Audio:</span>
                    <span className={debugState.performanceMetrics.audioLoaded ? 'status-loaded' : 'status-pending'}>
                      {debugState.performanceMetrics.audioLoaded ? '✓ Loaded' : '○ Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div className="debug-section">
                {debugState.componentStates.map((comp) => (
                  <div key={comp.name} className="component-card">
                    <div className="component-header">
                      <strong>{comp.name}</strong>
                      <span className="component-time">
                        {formatTime(comp.lastUpdate)}
                      </span>
                    </div>
                    <div className="component-data">
                      {Object.entries(comp).filter(([key]) => key !== 'name' && key !== 'lastUpdate').map(([key, value]) => (
                        <div key={key} className="data-row">
                          <span className="data-key">{key}:</span>
                          <span className="data-value">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="debug-section logs-section">
                {debugState.logs.slice().reverse().map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-time">[{formatTime(log.timestamp)}]</span>
                    <span className={`log-category category-${log.category.toLowerCase()}`}>
                      {log.category}
                    </span>
                    <span className="log-message">{log.message}</span>
                    {Object.keys(log.data).length > 0 && (
                      <div className="log-data">{JSON.stringify(log.data)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="debug-section errors-section">
                {debugState.errors.length === 0 ? (
                  <div className="no-errors">✓ No errors logged</div>
                ) : (
                  debugState.errors.slice().reverse().map((error, idx) => (
                    <div key={idx} className="error-entry">
                      <div className="error-header">
                        <span className="error-time">[{formatTime(error.timestamp)}]</span>
                        <span className="error-category">{error.category}</span>
                      </div>
                      <div className="error-message">{error.message}</div>
                      <div className="error-detail">{error.error.message}</div>
                      {error.error.stack && (
                        <pre className="error-stack">{error.error.stack}</pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="debug-section timeline-section">
                {debugState.timeline.slice().reverse().map((event, idx) => (
                  <div key={idx} className={`timeline-event event-${event.type}`}>
                    <span className="timeline-time">{formatTime(event.timestamp)}</span>
                    <span className="timeline-category">{event.category}</span>
                    <span className="timeline-message">{event.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;
