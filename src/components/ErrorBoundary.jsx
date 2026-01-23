import React from 'react';
import debugManager from '../utils/DebugManager.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    debugManager.error('React', 'Component error caught', error);
    this.setState({
      error,
      errorInfo
    });

    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #ff4444',
          borderRadius: '8px',
          padding: '30px',
          color: '#fff',
          fontFamily: 'Space Mono, monospace',
          maxWidth: '600px',
          zIndex: 99999
        }}>
          <h2 style={{ color: '#ff4444', marginTop: 0 }}>⚠️ Une erreur s'est produite</h2>
          <p style={{ color: '#ffaaaa' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <details style={{ marginTop: '20px', cursor: 'pointer' }}>
            <summary style={{ color: '#00ffc8' }}>Détails techniques</summary>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '300px',
              marginTop: '10px'
            }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'rgba(0, 255, 200, 0.2)',
              border: '1px solid #00ffc8',
              borderRadius: '4px',
              color: '#00ffc8',
              cursor: 'pointer',
              fontFamily: 'Space Mono, monospace'
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
