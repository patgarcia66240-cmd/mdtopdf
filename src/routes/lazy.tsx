import { lazy } from 'react';
import { Route } from '@tanstack/react-router';

// Composants de chargement optimisés
const LoadingFallback = ({ message = "Chargement..." }) => (
  <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

// Routes lazy avec stratégies de préchargement différentes
export const createLazyRoute = (
  importFn: () => Promise<{ default: any }>,
  options: {
    preload?: boolean;
    preloadDelay?: number;
    loadingMessage?: string;
  } = {}
) => {
  const {
    preload = false,
    preloadDelay = 0,
    loadingMessage = "Chargement..."
  } = options;

  // Préchargement automatique si demandé
  if (preload && typeof window !== 'undefined') {
    setTimeout(() => {
      importFn();
    }, preloadDelay);
  }

  return lazy(() =>
    importFn().catch(error => {
      console.error('Erreur de chargement du composant:', error);
      // Retourner un composant d'erreur
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-[400px] bg-red-50 dark:bg-red-900/20">
            <div className="text-center p-8">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Erreur de chargement
              </h2>
              <p className="text-red-600 dark:text-red-400">
                Impossible de charger cette page. Veuillez réessayer.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        )
      };
    })
  );
};

// Import optimisés des composants de page
export const HomePageLazy = createLazyRoute(
  () => import('../pages/HomePage'),
  {
    preload: true,
    preloadDelay: 1000,
    loadingMessage: "Chargement de l'accueil..."
  }
);

export const TemplatesPageLazy = createLazyRoute(
  () => import('../pages/TemplatesPage'),
  {
    preload: false, // Pas de préchargement pour cette page
    loadingMessage: "Chargement des templates..."
  }
);

export const TemplateDetailPageLazy = createLazyRoute(
  () => import('../pages/TemplateDetailPage'),
  {
    preload: false,
    loadingMessage: "Chargement du template..."
  }
);

export const ExportsPageLazy = createLazyRoute(
  () => import('../pages/ExportsPage'),
  {
    preload: false,
    loadingMessage: "Chargement des exports..."
  }
);

export const SettingsPageLazy = createLazyRoute(
  () => import('../pages/SettingsPage'),
  {
    preload: false,
    loadingMessage: "Chargement des paramètres..."
  }
);

export const NotFoundPageLazy = createLazyRoute(
  () => import('../pages/NotFoundPage'),
  {
    loadingMessage: "Page non trouvée..."
  }
);

// Composant wrapper pour gérer les états de chargement
export const LazyRouteWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <React.Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </React.Suspense>
  );
};

export default {
  HomePageLazy,
  TemplatesPageLazy,
  TemplateDetailPageLazy,
  ExportsPageLazy,
  SettingsPageLazy,
  NotFoundPageLazy,
  LazyRouteWrapper,
  LoadingFallback
};