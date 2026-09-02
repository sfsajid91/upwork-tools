import React from 'react';
import ReactDOM from 'react-dom/client';
import OptionsApp from './App.tsx';
import '../popup/style.css';

const root = document.getElementById('root');
if (!root) throw new Error('Options root element is missing');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>,
);
