import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import AdvancedExportPanel from '../components/export/AdvancedExportPanel';

export const ExportsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setIsDarkMode(mq ? mq.matches : false);
    apply();
    mq && mq.addEventListener && mq.addEventListener('change', apply);
    return () => { mq && mq.removeEventListener && mq.removeEventListener('change', apply); };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Centre d'Export
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Gérez vos exports et configurez les options avancées
        </p>

        <nav
          className="flex space-x-4 mb-6"
          role="navigation"
          aria-label="Navigation principale"
        >
          <Link
            to="/"
            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            aria-label="Retour à l'éditeur Markdown"
          >
            ← Retour à l'éditeur
          </Link>
          <Link
            to="/templates"
            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            aria-label="Aller au gestionnaire de templates"
          >
            Templates →
          </Link>
        </nav>
      </header>

      <main>
        <h2 className="sr-only">Options d'export avancées</h2>
        <div className="mb-6">
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Ouvrir l'export avancé
          </button>
        </div>

        <div ref={previewRef} aria-hidden="true" />

        {open && (
          <AdvancedExportPanel
            markdown={''}
            elementRef={previewRef as React.RefObject<HTMLElement>}
            isDarkMode={isDarkMode}
            onClose={() => setOpen(false)}
          />
        )}
      </main>
    </div>
  );
};
