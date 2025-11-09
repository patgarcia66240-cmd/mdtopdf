import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import router from './router';
import { AppQueryClientProvider } from './providers/QueryClientProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppQueryClientProvider>
      <RouterProvider router={router} />
    </AppQueryClientProvider>
  </React.StrictMode>
);
