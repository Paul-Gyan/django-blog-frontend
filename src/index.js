import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { globalStyles } from './styles/GlobalStyles';

// Inject global styles
const style = document.createElement('style');
style.textContent = globalStyles;
document.head.appendChild(style);

// Add Google Font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);