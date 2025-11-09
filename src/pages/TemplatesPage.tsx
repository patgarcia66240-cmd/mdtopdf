import React from 'react';
import { Link } from '@tanstack/react-router';
import TemplateSelectorEnhanced from '../components/templates/TemplateSelectorEnhanced';

export const TemplatesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestionnaire de Templates
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Choisissez et personnalisez vos templates pour l'exportation PDF
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
            to="/exports"
            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            aria-label="Aller au centre d'exports"
          >
            Mes exports →
          </Link>
        </nav>
      </header>

      <main>
        <h2 className="sr-only">Sélection de templates</h2>
        <TemplateSelectorEnhanced />
      </main>
    </div>
  );
};