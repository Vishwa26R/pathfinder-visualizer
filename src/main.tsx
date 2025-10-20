// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// Correctly import the default export from App.tsx
import App from './components/App'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Render the App component directly */}
    <App />
  </React.StrictMode>,
);