import React from 'react';
import { Link, useParams } from '@tanstack/react-router';

export const TemplateDetailPage: React.FC = () => {
  const { templateId } = useParams({ from: '/templates/$templateId' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Template: {templateId}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Personnalisez ce template pour vos exports PDF
            </p>
          </div>

          <nav className="flex space-x-4">
            <Link
              to="/templates"
              className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Tous les templates
            </Link>
            <Link
              to="/"
              className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Éditeur →
            </Link>
          </nav>
        </div>
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Éditeur de Template
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Éditeur pour le template "{templateId}" - Cette page sera développée prochainement.
          </p>

          <div
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            role="alert"
            aria-live="polite"
          >
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> L'éditeur de template sera intégré avec le composant TemplateEditor existant.
            </p>
          </div>
        </section>
    </div>
  );
};