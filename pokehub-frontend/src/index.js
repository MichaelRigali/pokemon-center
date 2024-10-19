// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Dynamically load the Google Font for the entire app
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
