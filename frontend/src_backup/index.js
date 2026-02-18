/* ============================================
   INDEX.JS - APPLICATION ENTRY POINT
   ============================================ */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
