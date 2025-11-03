import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ProMarkdownToPDF from './components/ProMarkdownToPDFRefactored';
import { AppQueryClientProvider } from './providers/QueryClientProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppQueryClientProvider>
      <ProMarkdownToPDF />
    </AppQueryClientProvider>
  </React.StrictMode>
);
