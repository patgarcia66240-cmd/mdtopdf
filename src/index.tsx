import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ProMarkdownToPDF from './components/ProMarkdownToPDFRefactored';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProMarkdownToPDF />
  </React.StrictMode>
);