import { lazy } from 'react';

// Dynamic imports optimisés avec gestion d'erreur et retry
export const createDynamicImport = <T>(
  importFn: () => Promise<{ default: T }>,
  options: {
    retries?: number;
    retryDelay?: number;
    timeout?: number;
    fallback?: T;
  } = {}
) => {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 5000,
    fallback
  } = options;

  return new Promise<{ default: T }>((resolve, reject) => {
    let attempt = 0;

    const tryImport = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, timeoutReject) => {
          setTimeout(() => timeoutReject(new Error('Import timeout')), timeout);
        });

        const result = await Promise.race([
          importFn(),
          timeoutPromise
        ]);

        resolve(result);
      } catch (error) {
        attempt++;
        if (attempt < retries) {
          console.warn(`Import attempt ${attempt} failed, retrying...`, error);
          setTimeout(tryImport, retryDelay * attempt);
        } else {
          console.error(`Import failed after ${retries} attempts:`, error);
          if (fallback) {
            resolve({ default: fallback });
          } else {
            reject(error);
          }
        }
      }
    };

    tryImport();
  });
};

// Dynamic imports pour composants lourds
export const PDFPreviewLazy = lazy(() =>
  createDynamicImport(() => import('../components/modules/PDFPreview'), {
    retries: 2,
    timeout: 3000
  })
);

export const AdvancedExportLazy = lazy(() =>
  createDynamicImport(() => import('../components/export/AdvancedExportPanel'), {
    retries: 2,
    timeout: 3000
  })
);

export const TemplateSelectorLazy = lazy(() =>
  createDynamicImport(() => import('../components/templates/TemplateSelectorEnhanced'), {
    retries: 2,
    timeout: 2000
  })
);

export const MarkdownEditorLazy = lazy(() =>
  createDynamicImport(() => import('../components/editor/MarkdownEditorEnhanced'), {
    retries: 2,
    timeout: 2000
  })
);

// Dynamic imports pour utilitaires
export const loadPDFUtils = () => createDynamicImport(() => import('../utils/pdfUtils'));
export const loadExportUtils = () => createDynamicImport(() => import('../utils/exportUtils'));
export const loadTemplateUtils = () => createDynamicImport(() => import('../utils/templateUtils'));
export const loadMarkdownUtils = () => createDynamicImport(() => import('../utils/markdownUtils'));

// Préchargement intelligent des ressources
export const preloadCriticalResources = async () => {
  const criticalImports = [
    () => import('../hooks/useLighthouseOptimization'),
    () => import('../components/seo/Helmet'),
    () => import('../utils/performance'),
  ];

  // Préchargement en parallèle avec faible priorité
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalImports.forEach(importFn => {
        importFn().catch(() => {
          // Ignorer les erreurs de préchargement
        });
      });
    });
  } else {
    // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
    setTimeout(() => {
      criticalImports.forEach(importFn => {
        importFn().catch(() => {
          // Ignorer les erreurs de préchargement
        });
      });
    }, 1000);
  }
};

// Préchargement basé sur l'interaction utilisateur
export const preloadOnInteraction = (eventName: string, importFn: () => Promise<any>) => {
  const handleInteraction = () => {
    importFn().catch(() => {
      // Ignorer les erreurs de préchargement
    });
    // Nettoyer les écouteurs
    document.removeEventListener(eventName, handleInteraction);
  };

  document.addEventListener(eventName, handleInteraction, { once: true });
};

// Préchargement basé sur le viewport
export const preloadOnViewport = (
  element: HTMLElement,
  importFn: () => Promise<any>,
  options: { rootMargin?: string } = {}
) => {
  const { rootMargin = '200px' } = options;

  if (!('IntersectionObserver' in window)) {
    // Fallback simple
    setTimeout(() => importFn(), 2000);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          importFn().catch(() => {
            // Ignorer les erreurs de préchargement
          });
          observer.disconnect();
        }
      });
    },
    { rootMargin }
  );

  observer.observe(element);
};

export default {
  createDynamicImport,
  PDFPreviewLazy,
  AdvancedExportLazy,
  TemplateSelectorLazy,
  MarkdownEditorLazy,
  loadPDFUtils,
  loadExportUtils,
  loadTemplateUtils,
  loadMarkdownUtils,
  preloadCriticalResources,
  preloadOnInteraction,
  preloadOnViewport
};