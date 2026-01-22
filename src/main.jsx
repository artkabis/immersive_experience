import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import all CSS files in correct order
import './styles/global.css';
import './styles/sections.css';
import './styles/ui.css';
import './styles/effects.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
