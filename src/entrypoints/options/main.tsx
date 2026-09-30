import React from 'react';
import ReactDOM from 'react-dom/client';
import SettingsApp from './App.tsx';
import '../popup/style.css';

const root = document.getElementById('root');
if (!root) throw new Error('Settings root element is missing');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <SettingsApp />
  </React.StrictMode>,
);
